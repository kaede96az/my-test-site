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
            <v-select
              v-if="item.type == 'select'"
              v-model="item.model.value"
              :label="item.label"
              @update:model-value="searchTrigerFunc"
              :items="item.selectList"
            ></v-select>
            <v-text-field
              v-else
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
    :custom-key-filter="customKeyFilter"
  >
    <template v-slot:[`item.manufacturer`]="item">
      <span class="manufacturer-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <span class="vaccine-name-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.vaccinated_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.onset_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.days_to_onset`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.causal_relationship`]="item">
      <CausualRelationshipRow :CR="item.value"></CausualRelationshipRow>
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

    <template v-slot:[`item.source.url`]="item">
      <a :href="item.item['source']['url']">{{ item.item['source']['name'] }}</a>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row>
          <v-col cols="12" md="6">
            <DatesAndPTnames
            :no="item.no"
            :vaccinated_dates="item.vaccinated_dates"
            :onset_dates="item.onset_dates"
            :PT_names="item.PT_names"
            :gross_result_dates="item.gross_result_dates"
            :gross_results="item.gross_results"
            :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"
            ></DatesAndPTnames>
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
import { AppBarTitle, AppBarColor, MedicalInstitutionReportsURL } from '@/router/data'
import { CausalRelationshipFunc, DateFilterFunc, NumberFilterFunc, StringArrayFilterFunc, StringArrayStrictFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import StringArrayRow from '@/components/StringArrayRow.vue'
import DatesRow from '@/components/DatesRow.vue'
import DatesAndPTnames from '@/components/DatesAndPTnames.vue'
import CausualRelationshipRow from '@/components/CausualRelationshipRow.vue'
import type { ShallowRef } from 'vue'
import type { IQueryParam } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'
import { CreateCsvContent, CreateFilteredData, DownloadCsvFile, FilterType, type IKeyAndFilter } from '@/types/FilteredDataAsCsv'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'
import type { IMedicalInstitutionReport } from '@/types/MedicalInstitutionReports'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IMedicalInstitutionReport[]>()
onMounted(() => {
  axios
    .get<IMedicalInstitutionReport[]>(MedicalInstitutionReportsURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get reported pfizer data: ' + error))
})

const headers = [
  { key: 'data-table-expand', width: 20 },
  { title: 'No.', align: 'start', key: 'no' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '接種日', align: 'start', key: 'vaccinated_dates' },
  { title: '症状発生日', align: 'start', key: 'onset_dates' },
  { title: '発症までの日数', align: 'start', key: 'days_to_onset' },
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 200 },
  { title: 'メーカー', align: 'start', key: 'manufacturer' },
  { title: 'ロット番号', align: 'start', key: 'lot_no' },
  { title: '症状名', align: 'start', key: 'PT_names' },
  { title: '因果関係', align: 'start', key: 'causal_relationship' },
  { title: '重篤度', align: 'start', key: 'severity' },
  { title: '転帰日', align: 'start', key: 'gross_result_dates' },
  { title: '転帰内容', align: 'start', key: 'gross_results' },
  { title: '元資料', align: 'start', key: 'source.url' }
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

const ptNameFilterVal = shallowRef('')
const ptNameFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, ptNameFilterVal)
}

const causualFilterVal = shallowRef('')
const causualFilterFunc = (value: any): boolean => {
  return CausalRelationshipFunc(value, causualFilterVal)
}

const severityFilterVal = shallowRef('')
const severityFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, severityFilterVal)
}

const resultDateFromFilterVal = shallowRef('')
const resultDateToFilterVal = shallowRef('')
const resultDateFilterFunc = (value: string): boolean => {
  return DateFilterFunc(value, resultDateFromFilterVal, resultDateToFilterVal)
}

const resultFilterVal = shallowRef('')
const resultFilterFunc = (value: any): boolean => {
  return StringArrayStrictFilterFunc(value, resultFilterVal)
}

const customKeyFilter = {
  age: ageFilterFunc,
  gender: genderFilterFunc,
  vaccinated_dates: vaccinatedDateFilterFunc,
  days_to_onset: daysToOnsetFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  manufacturer: makerFilterFunc,
  lot_no: lotNoFilterFunc,
  PT_names: ptNameFilterFunc,
  causal_relationship: causualFilterFunc,
  severity: severityFilterFunc,
  gross_result_dates: resultDateFilterFunc,
  gross_results: resultFilterFunc
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
  {name: "pt", val: ptNameFilterVal},
  {name: "cr", val: causualFilterVal},
  {name: "sv", val: severityFilterVal},
  {name: "rdf", val: resultDateFromFilterVal},
  {name: "rdt", val: resultDateToFilterVal},
  {name: "re", val: resultFilterVal},
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
  { sm: 4, label: "製造販売業者", model: makerFilterVal, type: "text"},
  { sm: 4, label: "ワクチン名", model: vaccineNameFilterVal, type: "text"},
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
  { sm: 4, label: "症状名(PT名)", model: ptNameFilterVal, type: "text"},
  { sm: 4, label: "因果関係", model: causualFilterVal, type: "select", selectList: ['', '(空白)', '関連なし', '評価不能', '関連あり']},
  { sm: 4, label: "重篤度", model: severityFilterVal, type: "select", selectList: ['', '重い', '重くない']},
  { sm: 2, label: "転帰日（from）", model: resultDateFromFilterVal, type: "date"},
  { sm: 2, label: "転帰日（to）", model: resultDateToFilterVal, type: "date"},
  { sm: 4, label: "転帰内容", model: resultFilterVal, type: "select", selectList: ['', '回復', '軽快', '未回復', '後遺症あり', '死亡', '不明', '未記入' ]},
]

const _blank = shallowRef('')
const keyAndFilterMap: IKeyAndFilter[] = [
  { key: "no", filterType: FilterType.Number , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "age", filterType: FilterType.Number , valFilter: _blank, fromFilter: ageFromFilterVal, toFilter: ageToFilterVal},
  { key: "gender", filterType: FilterType.String , valFilter: genderFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "vaccinated_dates", filterType: FilterType.DateArray , valFilter: _blank, fromFilter: vaccinatedDateFromFilterVal, toFilter: vaccinatedDateToFilterVal},
  { key: "onset_dates", filterType: FilterType.DateArray , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "days_to_onset", filterType: FilterType.NumberArray , valFilter: _blank, fromFilter: daysToOnsetFromFilterVal, toFilter: daysToOnsetToFilterVal},
  { key: "vaccine_name", filterType: FilterType.String , valFilter: vaccineNameFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "manufacturer", filterType: FilterType.String , valFilter: makerFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "lot_no", filterType: FilterType.String , valFilter: lotNoFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "PT_names", filterType: FilterType.StringArray , valFilter: ptNameFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "causal_relationship", filterType: FilterType.CausalRelationship , valFilter: causualFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "severity", filterType: FilterType.String , valFilter: severityFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "gross_result_dates", filterType: FilterType.DateArray , valFilter: _blank, fromFilter: resultDateFromFilterVal, toFilter: resultDateToFilterVal},
  { key: "gross_results", filterType: FilterType.StringArrayStrict , valFilter: resultFilterVal, fromFilter: _blank, toFilter: _blank},
]
const downloadFilterdDataAsCsv = () => {
  const filteredData = CreateFilteredData<IMedicalInstitutionReport>(keyAndFilterMap, dataTableItems)
  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContent<IMedicalInstitutionReport>(filteredData, headerTitles, headerKeys)

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

<style>
.expanded-row-style {
  border: medium dashed green;
  background-color: beige !important;
}
</style>
