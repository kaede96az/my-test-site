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
        <h6 class="text-h6">症状など申請に関する条件の設定</h6>
        <v-row>
          <v-col v-for="item, i in issueSearchItems" :key="i" cols="12" :sm="item.sm" class="group">
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

        <br />
        <h6 class="text-h6">個人に関する条件の設定</h6>
        <v-row>
          <v-col v-for="item, i in individualSearchItems" :key="i" cols="12" :sm="item.sm" class="group">
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
    :headers="headers as any "
    :search="SearchTrigger"
    :custom-filter="
      () => {
        return true
      }
    "
    density="compact"
    class="data-table-health-hazard"
    show-expand
    expand-on-click
    item-value="no"
    v-model:expanded="expandedArray"
    :custom-key-filter="customKeyFilter"
  >
    <template v-slot:[`item.vaccine_name`]="item">
      <span>{{ item.value }}</span>
    </template>

    <template v-slot:[`item.name`]="item">
      <SymptomsRow :sym="item.value"></SymptomsRow>
    </template>

    <template v-slot:[`item.type`]="item">
      <BillingDetailsChip :billing_type="item.value"></BillingDetailsChip>
    </template>

    <template v-slot:[`item.basic_disease`]="item">
      <BasicDiseaseRow :bd="item.value"></BasicDiseaseRow>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row>
          <v-col cols="12" md="6">
            <SymptomsCard :symptoms="item.name" :click-close="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"></SymptomsCard>
          </v-col>
          <v-col cols="12" md="6">
            <BasicDiseaseCard :basic_disease="item.basic_disease"></BasicDiseaseCard>
          </v-col>
        </v-row>
      </td>
    </template>

  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import router from '@/router/index'
import axios from 'axios'
import { AppBarTitle, AppBarColor, CertifiedHealthHazardDataURL } from '@/router/data'
import type { ICertifiedHealthHazardIssue } from '@/types/CertifiedHealthHazard'
import { NumberFilterFunc, DateFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { ShallowRef } from 'vue'
import BasicDiseaseRow from '@/components/BasicDiseaseRow.vue'
import BasicDiseaseCard from '@/components/BasicDiseaseCard.vue'
import SymptomsRow from '@/components/SymptomsRow.vue'
import SymptomsCard from '@/components/SymptomsCard.vue'
import BillingDetailsChip from '@/components/BillingDetailsChip.vue'
import type { IQueryParam } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'
import { CreateCsvContent, CreateFilteredData, DownloadCsvFile, FilterType, type IKeyAndFilter } from '@/types/FilteredDataAsCsv'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#4CAF50'

const loading = shallowRef(true)
const dataTableItems = shallowRef<ICertifiedHealthHazardIssue[]>()
onMounted(() => {
  axios
    .get<ICertifiedHealthHazardIssue[]>(CertifiedHealthHazardDataURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get certified heallth hazard data: ' + error))
})

const headers = [
  { key: 'data-table-expand', width: 20 },
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 110 },
  { title: '症状', align: 'start', key: 'name' },
  { title: '請求内容', align: 'start', key: 'type' },
  { title: '判定', align: 'start', key: 'result' },
  { title: '認定日', align: 'start', key: 'approved_date' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '基礎疾患', align: 'start', key: 'basic_disease' }
]

const expandedArray = shallowRef<string[]>([])

const vaccineNameFilterVal = shallowRef('')
const vaccineNameFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, vaccineNameFilterVal)
}

const symptomsFilterVal = shallowRef('')
const symptomsFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, symptomsFilterVal)
}

const billingTypeFilterVal = shallowRef('')
const billingTypeFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, billingTypeFilterVal)
}

const resultFilterVal = shallowRef('')
const resultFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, resultFilterVal)
}

const certifiedDateFromFilterVal = shallowRef('')
const certifiedDateToFilterVal = shallowRef('')
const certifiedDateFilterFunc = (value: string): boolean => {
  return DateFilterFunc(value, certifiedDateFromFilterVal, certifiedDateToFilterVal)
}

const ageFromFilterVal = shallowRef('')
const ageToFilterVal = shallowRef('')
const ageFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value, ageFromFilterVal, ageToFilterVal)
}

const genderFilterVal = shallowRef('')
const genderFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, genderFilterVal)
}

const preExistingConditionFilterVal = shallowRef('')
const preExistingConditionFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, preExistingConditionFilterVal)
}

const customKeyFilter = {
  vaccine_name: vaccineNameFilterFunc,
  name: symptomsFilterFunc,
  type: billingTypeFilterFunc,
  result: resultFilterFunc,
  approved_date: certifiedDateFilterFunc,
  age: ageFilterFunc,
  gender: genderFilterFunc,
  basic_disease: preExistingConditionFilterFunc
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
  let ret = issueSearchItems.find( item => isNotNullEmpty(item.model) )
  if(ret != undefined) return true

  ret = individualSearchItems.find( item => isNotNullEmpty(item.model) )
  if(ret != undefined) return true

  return false
}
const isNotNullEmpty = (val: ShallowRef<string>): boolean => {
  return val.value != '' && val.value != null
}

const pageQueryParams = router.currentRoute.value.query
const queryParamMap: IQueryParam[] = [
  {name: "vn", val: vaccineNameFilterVal},
  {name: "sym", val: symptomsFilterVal},
  {name: "tp", val: billingTypeFilterVal},
  {name: "re", val: resultFilterVal},
  {name: "cdf", val: certifiedDateFromFilterVal},
  {name: "cdt", val: certifiedDateToFilterVal},
  {name: "adf", val: ageFromFilterVal},
  {name: "adt", val: ageToFilterVal},
  {name: "gen", val: genderFilterVal},
  {name: "pre", val: preExistingConditionFilterVal},
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

const issueSearchItems = [
  { sm: 3, label: "ワクチン名", model: vaccineNameFilterVal, type: "text"},
  { sm: 3, label: "判定", model: resultFilterVal, type: "text"},
  { sm: 6, label: "症状", model: symptomsFilterVal, type: "text"},
  { sm: 3, label: "認定日（from）", model: certifiedDateFromFilterVal, type: "date"},
  { sm: 3, label: "認定日（to）", model: certifiedDateToFilterVal, type: "date"},
  { sm: 6, label: "請求内容", model: billingTypeFilterVal, type: "text"},
]
const individualSearchItems = [
  { sm: 2, label: "年齢（from）", model: ageFromFilterVal, type: "number"},
  { sm: 2, label: "年齢（to）", model: ageToFilterVal, type: "number"},
  { sm: 4, label: "性別", model: genderFilterVal, type: "text"},
  { sm: 4, label: "基礎疾患", model: preExistingConditionFilterVal, type: "text"},
]

const keyAndFilterMap: IKeyAndFilter[] = [
  { key: "vaccine_name", filterType: FilterType.String , valFilter: vaccineNameFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "name", filterType: FilterType.String , valFilter: symptomsFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "type", filterType: FilterType.String , valFilter: billingTypeFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "result", filterType: FilterType.String , valFilter: resultFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "approved_date", filterType: FilterType.Date , valFilter: shallowRef(''), fromFilter: certifiedDateFromFilterVal, toFilter: certifiedDateToFilterVal},
  { key: "age", filterType: FilterType.Number , valFilter: shallowRef(''), fromFilter: ageFromFilterVal, toFilter: ageToFilterVal},
  { key: "gender", filterType: FilterType.String , valFilter: genderFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "basic_disease", filterType: FilterType.String , valFilter: preExistingConditionFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
]
const downloadFilterdDataAsCsv = () => {
  const filteredData = CreateFilteredData<ICertifiedHealthHazardIssue>(keyAndFilterMap, dataTableItems)
  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContent<ICertifiedHealthHazardIssue>(filteredData, headerTitles, headerKeys)

  DownloadCsvFile(router.currentRoute.value.path.replace('/',''), csvContent)
}
const clearFilter = () => {
  issueSearchItems.forEach(item => {
    item.model.value = ''
  });
  individualSearchItems.forEach(item => {
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
</style>
