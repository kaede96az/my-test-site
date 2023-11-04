<template>
  <v-expansion-panels v-model="expandSearchCard">
    <v-expansion-panel>
      <v-expansion-panel-title color="#66BB6A">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span class="search-title">詳細検索...</span>
        <v-spacer></v-spacer>
        <v-chip v-if="searchConditionChanged" size="small" variant="elevated" color="orange-lighten-3">変更あり</v-chip>
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

      <v-divider></v-divider>

      <v-expansion-panel-text>
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn prepend-icon="mdi-content-copy" color="green-darken-1" @click="createUrlWithQueryParams" v-bind="props">この検索条件のURLをコピーする</v-btn>
          </template>
          クリップボードにURLをコピーしました!
        </v-snackbar>
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn prepend-icon="mdi-content-copy" color="green-darken-1" @click="createFilteredTableData" v-bind="props">この検索条件のURLをコピーする</v-btn>
          </template>
          クリップボードに検索結果のデータをコピーしました!
        </v-snackbar>
      </v-expansion-panel-text>

    </v-expansion-panel>
  </v-expansion-panels>
  <br />

  <v-data-table
    loading-text="データを読み込み中です。"
    :loading="loading"
    :items="items as any"
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
      symptom_name: symptomsFilterFunc,
      sum_count: sumFilterFunc
    }"
  >
    <template v-slot:[`item.symptom_name`]="item">
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
import type { ICertifiedSymptoms } from '@/types/CertifiedSymptom'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { ShallowRef } from 'vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#4CAF50'

const loading = shallowRef(true)
const items = shallowRef<ICertifiedSymptoms>()
onMounted(() => {
  axios
    .get<ICertifiedSymptoms>(CertifiedSymptomsDataURL)
    .then((response) => {
      items.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get certified symptoms data: ' + error))
})

const headers = [
  { title: '症状', align: 'start', key: 'symptom_name' },
  { title: '件数 (男性)', align: 'end', key: 'male_count' },
  { title: '件数 (女性)', align: 'end', key: 'female_count' },
  { title: '合計件数', align: 'end', key: 'sum_count' }
]

const expandSearchCard = shallowRef<Number[]>([])

// todo: Navigate先のURLをここに直書きしているため、routes側を変更時に一致しなくなる可能性が・・
const navigateWithQuery = (value: string) => {
  router.push({ path: 'certified-issues', query: { sym: value } })
}

const symptomsFilterVal = shallowRef('')
const symptomsFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, symptomsFilterVal)
}

const sumFromFilterVal = shallowRef('')
const sumToFilterVal = shallowRef('')
const sumFilterFunc = (value: string): boolean => {
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
const queryParamMap = [
  {name: "sym", val: symptomsFilterVal},
  {name: "sf", val: sumFromFilterVal},
  {name: "st", val: sumToFilterVal},
]
queryParamMap.forEach(item => {
  const param = pageQueryParams[item.name]
  if(param != undefined) {
    item.val.value = param.toString()
    expandSearchCard.value = [0]
    searchConditionChanged.value = true
  }
});
const createUrlWithQueryParams = () => {
  let retUrl = window.location.origin + '/#' + router.currentRoute.value.path + '?'
  let isFirstQuery = true
  queryParamMap.forEach(item => {
    if(isNotNullEmpty(item.val)) {
      if(isFirstQuery){
        retUrl = retUrl + item.name + '=' + item.val.value
        isFirstQuery = false
      } else {
        retUrl = retUrl + '&' + item.name + '=' + item.val.value
      }
    }
  });

  if(navigator.clipboard){
    navigator.clipboard.writeText(retUrl);
  }
}

const searchItems = [
  { sm: 6, label: "症状", model: symptomsFilterVal, type: "text"},
  { sm: 3, label: "合計件数（最小値）", model: sumFromFilterVal, type: "number"},
  { sm: 3, label: "合計件数（最大値）", model: sumToFilterVal, type: "number"},
]

const createFilteredTableData = () => {
  const filteredTableData = items.value?.issues.filter(issue => {
    if(isNotNullEmpty(symptomsFilterVal)){
      if(issue.symptom_name.indexOf(symptomsFilterVal.value) < 0) return false
    }
  })

  if(navigator.clipboard && filteredTableData != undefined){
    navigator.clipboard.writeText(filteredTableData.toString());
  }
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
