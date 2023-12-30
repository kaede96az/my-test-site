<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title color="#66BB6A">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span class="search-title">詳細検索...</span>
        <v-spacer></v-spacer>
        <v-chip v-if="searchConditionChanged" size="small" variant="elevated" color="orange-lighten-3">検索ワード入力中</v-chip>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row>
          <v-col v-for="item, i in searchItems" :key="i" cols="12" :sm="item.sm" class="group">
            <v-text-field
              :label="item.label"
              v-model="item.model.value"
              :type="item.type"
              @input="searchTrigerFunc"
              @click:clear="clearTriggerFunc"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-expansion-panel-text>

    </v-expansion-panel>

    <v-expansion-panel>
      <SearchRelatedToolBar btn-color="green-darken-3" :copy-func="copyUrlWithQueryParams" :download-func="downloadFilterdDataAsCsv" :clear-func="clearFilter"></SearchRelatedToolBar>
    </v-expansion-panel>

  </v-expansion-panels>
  <br />

  <v-data-table
    loading-text="データを読み込み中です。"
    :loading="loading"
    :items="dataTableItems as any"
    :headers="headers as any"
    :search="SearchTrigger"
    :custom-filter="
      () => {
        return true
      }
    "
    density="compact"
    class="data-table-health-hazard"
    :custom-key-filter="{
      name: symptomsFilterFunc,
      'counts.sum': sumFilterFunc
    }"
    items-per-page-text="ページに表示する項目数"
  >
    <template v-slot:[`item.name`]="item">
      <v-btn variant="text" color="deep-purple-darken-1" @click="navigateWithQuery(item.value)" class="text-none"><b>{{ item.value }}</b></v-btn>
      <span></span>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import router from '@/router/index'
import axios from 'axios'
import { AppBarTitle, AppBarColor, CertifiedSymptomsDataURL } from '@/router/data'
import { NumberFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import type { ICertifiedSymptom } from '@/types/CertifiedSymptom'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { ShallowRef } from 'vue'
import type { IQueryParam } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'
import { CreateCsvContent, CreateFilteredData, DownloadCsvFile, FilterType, type IKeyAndFilter } from '@/types/FilteredDataAsCsv'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'green'

const loading = shallowRef(true)
const dataTableItems = shallowRef<ICertifiedSymptom[]>()
onMounted(() => {
  axios
    .get<ICertifiedSymptom[]>(CertifiedSymptomsDataURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get certified symptoms data: ' + error))
})

const headers = [
  { title: '症状', align: 'start', key: 'name' },
  { title: '件数 (男性)', align: 'end', key: 'counts.male' },
  { title: '件数 (女性)', align: 'end', key: 'counts.female' },
  { title: '合計件数', align: 'end', key: 'counts.sum' }
]

// todo: Navigate先のURLをここに直書きしているため、routes側を変更時に一致しなくなる可能性が・・
const navigateWithQuery = (value: string) => {
  router.push({ path: 'certified-issues', query: { sym: value } })
}

const symptomsFilterVal = shallowRef('')
const symptomsFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, symptomsFilterVal)
}

const sumFromFilterVal = shallowRef<any>('')
const sumToFilterVal = shallowRef<any>('')
const sumFilterFunc = (value: any): boolean => {
  return NumberFilterFunc(value, sumFromFilterVal, sumToFilterVal)
}

const searchConditionChanged = shallowRef<boolean>(false)
const searchTrigerFunc = () => {
  SearchTriggerFunc()
  searchConditionChanged.value = isConditionChanged()
}
const clearTriggerFunc = () => {
  searchConditionChanged.value = isConditionChanged()
}
const isConditionChanged = () => {
  let ret = searchItems.find( item => isNotNullEmpty(item.model) )
  if(ret != undefined) return true

  return false
}
const isNotNullEmpty = (val: ShallowRef<string>): boolean => {
  return val.value != '' && val.value != null
}

const pageQueryParams = router.currentRoute.value.query
const queryParamMap: IQueryParam[] = [
  {name: "sym", val: symptomsFilterVal},
  {name: "sf", val: sumFromFilterVal},
  {name: "st", val: sumToFilterVal},
]
queryParamMap.forEach(item => {
  const param = pageQueryParams[item.name]
  if(param != undefined) {
    item.val.value = param.toString()
    searchConditionChanged.value = true
  }
});
const copyUrlWithQueryParams = () => {
  const retUrl = CreateUrlWithQueryParams(queryParamMap)
  if(navigator.clipboard){
    navigator.clipboard.writeText(retUrl);
  }
}

const searchItems = [
  { sm: 6, label: "症状", model: symptomsFilterVal, type: "text"},
  { sm: 3, label: "合計件数（最小値）", model: sumFromFilterVal, type: "number"},
  { sm: 3, label: "合計件数（最大値）", model: sumToFilterVal, type: "number"},
]

const _blank = shallowRef('')
const keyAndFilterMap: IKeyAndFilter[] = [
  { key: "name", filterType: FilterType.String , valFilter: symptomsFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "counts.sum", filterType: FilterType.Number , valFilter: _blank, fromFilter: sumFromFilterVal, toFilter: sumToFilterVal},
]
const downloadFilterdDataAsCsv = () => {
  const filteredData = CreateFilteredData<ICertifiedSymptom>(keyAndFilterMap, dataTableItems)
  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContent<ICertifiedSymptom>(filteredData, headerTitles, headerKeys)

  DownloadCsvFile(router.currentRoute.value.path.replace('/',''), csvContent)
}
const clearFilter = () => {
  searchItems.forEach(item => {
    item.model.value = ''
  });
  searchConditionChanged.value = false
}
</script>

<style scoped>
.group {
  padding-top: 0.4rem;
  padding-bottom: 0.3rem;
}

.search-icon {
  font-size: 2rem;
}
.search-title {
  font-size: 1.5rem;
  padding-left: 0.8rem;
}

.hosoku {
  margin-top: auto;
}
</style>
