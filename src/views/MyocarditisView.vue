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
    <template v-slot:[`item.manufacturer`]="item">
      <span class="manufacturer-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <span class="vaccine-name-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.onset_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.pre_existing_disease_names`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.PT_names`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>    

    <template v-slot:[`item.gross_result_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.gross_results`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.source`]="item">
      <a :href="(item.value as ISourceInfo).url">{{ (item.value as ISourceInfo).name }}</a>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row>
          <v-col cols="12" md="6">
            <DateAndPTnames
            :no="item.no"
            :vaccinated_date="item.vaccinated_date"
            :onset_dates="item.onset_dates"
            :PT_names="item.PT_names"
            :gross_result_dates="item.gross_result_dates"
            :gross_results="item.gross_results"
            :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"
            ></DateAndPTnames>
          </v-col>
          <v-col cols="12" md="6">
            <PreExistingDiseaseCard :pre_existing_disease_names="item.pre_existing_disease_names"></PreExistingDiseaseCard>
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
import { AppBarTitle, AppBarColor, CarditisReportsURL } from '@/router/data'
import router from '@/router/index'
import { DateArrayFilterFunc, DateFilterFunc, NumberFilterFunc, StringArrayFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import StringArrayRow from '@/components/StringArrayRow.vue'
import DatesRow from '@/components/DatesRow.vue'
import PreExistingDiseaseCard from '@/components/PreExistingDiseaseCard.vue'
import DateAndPTnames from '@/components/DateAndPTnames.vue'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { ShallowRef } from 'vue'
import type { IQueryParam } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'
import { CreateCsvContent, CreateFilteredData, DownloadCsvFile, FilterType, type IKeyAndFilter } from '@/types/FilteredDataAsCsv'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'
import type { ISourceInfo } from '@/types/Summary'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IReportedMyocarditisIssue[]>()
onMounted(() => {
  axios
    .get<IReportedMyocarditisIssue[]>(CarditisReportsURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get myocarditis data: ' + error))
})

const headers = [
  { key: 'data-table-expand', width: 10 },
  { title: 'No', align: 'start', key: 'no'},
  { title: '年齢', align: 'start', key: 'age'},
  { title: '性別', align: 'start', key: 'gender'},
  { title: '接種日', align: 'start', key: 'vaccinated_date'},
  { title: '症状発生日', align: 'start', key: 'onset_dates'},
  { title: '発症までの日数', align: 'start', key: 'days_to_onset'},
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name'},
  { title: '製造販売業者', align: 'start', key: 'manufacturer'},
  { title: 'ロット番号', align: 'start', key: 'lot_no'},
  { title: '接種回数', align: 'start', key: 'vaccinated_times'},
  { title: '基礎疾患', align: 'start', key: 'pre_existing_disease_names' },
  { title: '症状名', align: 'start', key: 'PT_names' },
  { title: '転帰日', align: 'start', key: 'gross_result_dates' },
  { title: '転帰内容', align: 'start', key: 'gross_results' },
  { title: '評価', align: 'start', key: 'evaluated_result'},
  { title: '元資料', align: 'start', key: 'source'}
]

let expandedArray = shallowRef([])

const manufacturerFilterVal = shallowRef('')
const manufacturerFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, manufacturerFilterVal)
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

const preExistingDiseaseFilterVal = shallowRef('')
const preExistingDiseaseFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, preExistingDiseaseFilterVal)
}

const PTnamesFilterVal = shallowRef('')
const PTnamesFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, PTnamesFilterVal)
}

const grossResultDateFromFilterVal = shallowRef('')
const grossResultDateToFilterVal = shallowRef('')
const grossResultDateFilterFunc = (value: any): boolean => {
  return DateArrayFilterFunc(value, grossResultDateFromFilterVal, grossResultDateToFilterVal)
}

const grossResultFilterVal = shallowRef('')
const grossResultFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, grossResultFilterVal)
}

const keyFilters = {
  manufacturer: manufacturerFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  lot_no: lotNoFilterFunc,
  age: ageFilterFunc,
  gender: genderFilterFunc,
  vaccinated_date: vaccinatedDateFilterFunc,
  days_to_onset: daysToOnsetFilterFunc,
  vaccinated_times: vaccinatedTimesFilterFunc,
  pre_existing_disease_names: preExistingDiseaseFilterFunc,
  PT_names: PTnamesFilterFunc,
  gross_result_dates: grossResultDateFilterFunc,
  gross_results: grossResultFilterFunc
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
  {name: "mk", val: manufacturerFilterVal},
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
  {name: "pre", val: preExistingDiseaseFilterVal},
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
  { sm: 4, label: "ワクチン名", model: vaccineNameFilterVal, type: "text"},
  { sm: 4, label: "製造販売業者", model: manufacturerFilterVal, type: "text"},
  { sm: 4, label: "ロット番号", model: lotNoFilterVal, type: "text"}
]
const individualSearchItems = [
  { sm: 1, label: "年齢（from）", model: ageFromFilterVal, type: "number"},
  { sm: 1, label: "年齢（to）", model: ageToFilterVal, type: "number"},
  { sm: 2, label: "性別", model: genderFilterVal, type: "text"},
  { sm: 2, label: "接種日（from）", model: vaccinatedDateFromFilterVal, type: "date"},
  { sm: 2, label: "接種日（to）", model: vaccinatedDateToFilterVal, type: "date"},
  { sm: 2, label: "発症までの日数（from）", model: daysToOnsetFromFilterVal, type: "number"},
  { sm: 2, label: "発症までの日数（to）", model: daysToOnsetToFilterVal, type: "number"},
  { sm: 2, label: "接種回数（from）", model: vaccinatedTimesFromFilterVal, type: "number"},
  { sm: 2, label: "接種回数（to）", model: vaccinatedTimesToFilterVal, type: "number"},
  { sm: 4, label: "基礎疾患", model: preExistingDiseaseFilterVal, type: "text"},
  { sm: 4, label: "症状", model: PTnamesFilterVal, type: "text"},
]

const _blank = shallowRef('')
const keyAndFilterMap: IKeyAndFilter[] = [
  { key: "no", filterType: FilterType.String , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "age", filterType: FilterType.Number , valFilter: _blank, fromFilter: ageFromFilterVal, toFilter: ageToFilterVal},
  { key: "gender", filterType: FilterType.String , valFilter: genderFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "vaccinated_date", filterType: FilterType.Date , valFilter: _blank, fromFilter: vaccinatedDateFromFilterVal, toFilter: vaccinatedDateToFilterVal},
  { key: "onset_dates", filterType: FilterType.Date , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "days_to_onset", filterType: FilterType.Number , valFilter: _blank, fromFilter: daysToOnsetFromFilterVal, toFilter: daysToOnsetToFilterVal},
  { key: "vaccine_name", filterType: FilterType.String , valFilter: vaccineNameFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "manufacturer", filterType: FilterType.String , valFilter: manufacturerFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "lot_no", filterType: FilterType.String , valFilter: lotNoFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "PT_names", filterType: FilterType.String , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "vaccinated_times", filterType: FilterType.Number , valFilter: _blank, fromFilter: vaccinatedTimesFromFilterVal, toFilter: vaccinatedTimesToFilterVal},
  { key: "pre_existing_disease_names", filterType: FilterType.String , valFilter: preExistingDiseaseFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "evaluated_result", filterType: FilterType.String , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
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
.manufacturer-text {
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
