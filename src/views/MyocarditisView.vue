<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title color="#00b0ff">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span class="search-title">詳細検索...</span>
        <v-spacer></v-spacer>
        <v-chip v-if="searchConditionChanged" size="small" variant="elevated" color="orange-lighten-3">検索ワード入力中</v-chip>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <h6 class="text-h6">ワクチンに関する条件の設定</h6>
        <v-row>
          <v-col v-for="item, i in vaccineSearchItems" :key="i" cols="12" :sm="item.sm">
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
      <SearchRelatedToolBar btn-color="blue-darken-3" :copy-func="copyUrlWithQueryParams" :download-func="downloadFilterdDataAsCsv" :clear-func="clearFilter"></SearchRelatedToolBar>
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
    class="data-table-suspect-issues"
    show-expand
    expand-on-click
    item-value="no"
    v-model:expanded="expandedArray"
    :custom-key-filter="keyFilters"
  >
    <template v-slot:[`item.maker`]="item">
      <span class="maker-text">{{ item.value }}</span>
    </template>
    <template v-slot:[`item.vaccine_name`]="item">
      <span class="vaccine-name-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.date_occurred`]="item">
      <DateOccurredRow :date="item.value"></DateOccurredRow> 
    </template>

    <template v-slot:[`item.PT`]="item">
      <PtRow :PT="item.value"></PtRow>
    </template>

    <template v-slot:[`item.basic_disease`]="item">
      <BasicDiseaseRow :bd="item.value"></BasicDiseaseRow>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row>
          <v-col cols="12" md="6">
            <DateAndPT
            :no="item.no"
            :date_vaccinated="item.date_vaccinated"
            :date_occurred="item.date_occurred"
            :PT="item.PT"
            postfix="）"
            CR=''
            :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"
            ></DateAndPT>
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
import axios from 'axios'
import type { IReportedMyocarditisIssue } from '@/types/ReportedMyocarditis'
import { AppBarTitle, AppBarColor, ReportedMyocarditisDataURL } from '@/router/data'
import router from '@/router/index'
import { DateFilterFunc, NumberFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import BasicDiseaseRow from '@/components/BasicDiseaseRow.vue'
import DateOccurredRow from '@/components/DateOccurredRow.vue'
import BasicDiseaseCard from '@/components/BasicDiseaseCard.vue'
import PtRow from '@/components/PtRow.vue'
import DateAndPT from '@/components/DateAndPT.vue'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { ShallowRef } from 'vue'
import type { IQueryParam } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'
import { CreateCsvContent, CreateFilteredData, DownloadCsvFile, FilterType, type IKeyAndFilter } from '@/types/FilteredDataAsCsv'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IReportedMyocarditisIssue[]>()
onMounted(() => {
  axios
    .get<IReportedMyocarditisIssue[]>(ReportedMyocarditisDataURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get myocarditis data: ' + error))
})

const headers = [
  { key: 'data-table-expand', width: 20 },
  { title: 'No', align: 'start', key: 'no' },
  { title: 'メーカー', align: 'start', key: 'maker', width: 110},
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 110 },
  { title: 'ロット番号', align: 'start', key: 'lot_no' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '接種日', align: 'start', key: 'date_vaccinated' },
  { title: '症状発生日', align: 'start', key: 'date_occurred' },
  { title: '発症までの日数', align: 'start', key: 'diff' },
  { title: '症状名', align: 'start', key: 'PT' },
  { title: '接種回数', align: 'start', key: 'count' },
  { title: '基礎疾患', align: 'start', key: 'basic_disease' },
  { title: '評価', align: 'start', key: 'evaluation' }
]

let expandedArray = shallowRef([])

const makerFilterVal = shallowRef('')
const makerFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, makerFilterVal)
}

const vaccineNameFilterVal = shallowRef('')
const vaccineNameFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, vaccineNameFilterVal)
}

const lotNoFilterVal = shallowRef('')
const lotNoFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, lotNoFilterVal)
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

const vaccinatedDateFromFilterVal = shallowRef('')
const vaccinatedDateToFilterVal = shallowRef('')
const vaccinatedDateFilterFunc = (value: string): boolean => {
  return DateFilterFunc(value, vaccinatedDateFromFilterVal, vaccinatedDateToFilterVal)
}

const daysToOnsetFromFilterVal = shallowRef('')
const daysToOnsetToFilterVal = shallowRef('')
const daysToOnsetFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value, daysToOnsetFromFilterVal, daysToOnsetToFilterVal)
}

const vaccinatedTimesFromFilterVal = shallowRef('')
const vaccinatedTimesToFilterVal = shallowRef('')
const vaccinatedTimesFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value.replace('回目', ''), vaccinatedTimesFromFilterVal, vaccinatedTimesToFilterVal)
}

const preExistingConditionFilterVal = shallowRef('')
const preExistingConditionFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, preExistingConditionFilterVal)
}

const keyFilters = {
  maker: makerFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  lot_no: lotNoFilterFunc,
  age: ageFilterFunc,
  gender: genderFilterFunc,
  date_vaccinated: vaccinatedDateFilterFunc,
  diff: daysToOnsetFilterFunc,
  count: vaccinatedTimesFilterFunc,
  basic_disease: preExistingConditionFilterFunc,
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
  let ret = vaccineSearchItems.find( item => isNotNullEmpty(item.model) )
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
  {name: "mk", val: makerFilterVal},
  {name: "vn", val: vaccineNameFilterVal},
  {name: "ln", val: lotNoFilterVal},
  {name: "adf", val: ageFromFilterVal},
  {name: "adt", val: ageToFilterVal},
  {name: "gen", val: genderFilterVal},
  {name: "vdf", val: vaccinatedDateFromFilterVal},
  {name: "vdt", val: vaccinatedDateToFilterVal},
  {name: "dtof", val: daysToOnsetFromFilterVal},
  {name: "dtot", val: daysToOnsetToFilterVal},
  {name: "vtf", val: vaccinatedTimesFromFilterVal},
  {name: "vtt", val: vaccinatedTimesToFilterVal},
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

const vaccineSearchItems = [
  { sm: 4, label: "メーカー", model: makerFilterVal, type: "text"},
  { sm: 4, label: "ワクチン名", model: vaccineNameFilterVal, type: "text"},
  { sm: 4, label: "ロット番号", model: lotNoFilterVal, type: "text"}
]
const individualSearchItems = [
  { sm: 2, label: "年齢（from）", model: ageFromFilterVal, type: "number"},
  { sm: 2, label: "年齢（to）", model: ageToFilterVal, type: "number"},
  { sm: 4, label: "性別", model: genderFilterVal, type: "text"},
  { sm: 2, label: "接種日（from）", model: vaccinatedDateFromFilterVal, type: "date"},
  { sm: 2, label: "接種日（to）", model: vaccinatedDateToFilterVal, type: "date"},
  { sm: 2, label: "発症までの日数（from）", model: daysToOnsetFromFilterVal, type: "number"},
  { sm: 2, label: "発症までの日数（to）", model: daysToOnsetToFilterVal, type: "number"},
  { sm: 2, label: "接種回数（from）", model: vaccinatedTimesFromFilterVal, type: "number"},
  { sm: 2, label: "接種回数（to）", model: vaccinatedTimesToFilterVal, type: "number"},
  { sm: 4, label: "基礎疾患", model: preExistingConditionFilterVal, type: "text"},
]

const _blank = shallowRef('')
const keyAndFilterMap: IKeyAndFilter[] = [
  { key: "no", filterType: FilterType.String , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "maker", filterType: FilterType.String , valFilter: makerFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "vaccine_name", filterType: FilterType.String , valFilter: vaccineNameFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "lot_no", filterType: FilterType.String , valFilter: lotNoFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "age", filterType: FilterType.Number , valFilter: _blank, fromFilter: ageFromFilterVal, toFilter: ageToFilterVal},
  { key: "gender", filterType: FilterType.String , valFilter: genderFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "date_vaccinated", filterType: FilterType.Date , valFilter: _blank, fromFilter: vaccinatedDateFromFilterVal, toFilter: vaccinatedDateToFilterVal},
  { key: "date_occurred", filterType: FilterType.Date , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "diff", filterType: FilterType.Number , valFilter: _blank, fromFilter: daysToOnsetFromFilterVal, toFilter: daysToOnsetToFilterVal},
  { key: "PT", filterType: FilterType.String , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "count", filterType: FilterType.Number , valFilter: _blank, fromFilter: vaccinatedTimesFromFilterVal, toFilter: vaccinatedTimesToFilterVal},
  { key: "basic_disease", filterType: FilterType.String , valFilter: preExistingConditionFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "evaluation", filterType: FilterType.String , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
]
const downloadFilterdDataAsCsv = () => {
  const filteredData = CreateFilteredData<IReportedMyocarditisIssue>(keyAndFilterMap, dataTableItems)
  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContent<IReportedMyocarditisIssue>(filteredData, headerTitles, headerKeys)

  DownloadCsvFile(router.currentRoute.value.path.replace('/',''), csvContent)
}
const clearFilter = () => {
  vaccineSearchItems.forEach(item => {
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
.maker-text {
  font-size: 0.9rem;
}
.vaccine-name-text {
  font-size: 0.74rem;
}

.search-icon {
  font-size: 2rem;
}
.search-title {
  font-size: 1.5rem;
  padding-left: 0.8rem;
}
</style>
