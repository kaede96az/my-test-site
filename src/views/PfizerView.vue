<template>
  <v-expansion-panels v-model="expandSearchCard">
    <v-expansion-panel>
      <v-expansion-panel-title color="#00b0ff">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span class="search-title">詳細検索...</span>
        <v-spacer></v-spacer>
        <v-chip v-if="searchConditionChanged" size="small" variant="elevated" color="orange-lighten-3">変更あり</v-chip>
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

      <v-divider></v-divider>

      <v-expansion-panel-text>
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn prepend-icon="mdi-content-copy" color="green-darken-1" @click="copyUrlWithQueryParams" v-bind="props">この検索条件のURLをコピーする</v-btn>
          </template>
          クリップボードにURLをコピーしました!
        </v-snackbar>
      </v-expansion-panel-text>

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
    <template v-slot:[`item.maker`]="item">
      <span class="maker-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <span class="vaccine-name-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.PT_name`]="item">
      <PtRow :PT="item.value"></PtRow>
    </template>

    <template v-slot:[`item.date_occurred`]="item">
      <DateOccurredRow :date="item.value"></DateOccurredRow> 
    </template>

    <template v-slot:[`item.causual`]="item">
      <CausualRelationshipRow :CR="item.value"></CausualRelationshipRow>
    </template>

    <template v-slot:[`item.result_date`]="item">
      <ResultDateRow :date="item.value"></ResultDateRow>
    </template>

    <template v-slot:[`item.result`]="item">
      <ResultRow :result="item.value"></ResultRow>
    </template>

    <template v-slot:[`item.source`]="item">
      <a :href="findLinkItem(item.value).url">{{ item.value }}</a>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <VaccinatedPtResultCard
          :no="item.no"
          :date_vaccinated="item.date_vaccinated"
          :date_occurred="item.date_occurred"
          :PT="item.PT_name"
          postfix="）"
          :CR="item.causual"
          :result="item.result"
          :result_date="item.result_date"
          :link-item="findLinkItem(item.source)"
          :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"
        ></VaccinatedPtResultCard>
      </td>
    </template>

  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import router from '@/router/index'
import axios from 'axios'
import { AppBarTitle, AppBarColor, ReportedPfizerDataURL, PfizerSourceListURL } from '@/router/data'
import { DateFilterFunc, NumberFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import type { IReportedPfizerIssues } from '@/types/Pfizer'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import DateOccurredRow from '@/components/DateOccurredRow.vue'
import ResultDateRow from '@/components/ResultDateRow.vue'
import ResultRow from '@/components/ResultRow.vue'
import PtRow from '@/components/PtRow.vue'
import VaccinatedPtResultCard from '@/components/VaccinatedPtResultCard.vue'
import CausualRelationshipRow from '@/components/CausualRelationshipRow.vue'
import type { ShallowRef } from 'vue'
import type { ISourceItem, ISourceList } from '@/types/SourceList'
import type { IQueryParam } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IReportedPfizerIssues>()
const sourceList = shallowRef<ISourceList>()
onMounted(() => {
  axios
    .get<IReportedPfizerIssues>(ReportedPfizerDataURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get reported pfizer data: ' + error))

  axios
    .get<ISourceList>(PfizerSourceListURL)
    .then((response) => {
      sourceList.value = response.data
    })
    .catch((error) => console.log('failed to get source list for pfizer data: ' + error))
})

const findLinkItem = (value: string): ISourceItem => {
  const item = sourceList.value?.source_pdf_list.find( x => x.name == value )
  return item != undefined ? item : {"name": "", "url": "#"}
}

const headers = [
  { key: 'data-table-expand', width: 20 },
  { title: 'No.', align: 'start', key: 'no' },
  { title: 'メーカー', align: 'start', key: 'maker' },
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 200 },
  { title: 'ロット番号', align: 'start', key: 'lot_no' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '接種日', align: 'start', key: 'date_vaccinated' },
  { title: '症状発生日', align: 'start', key: 'date_occurred' },
  { title: '発症までの日数', align: 'start', key: 'diff' },
  { title: '症状名', align: 'start', key: 'PT_name' },
  { title: '因果関係', align: 'start', key: 'causual' },
  { title: '転帰日', align: 'start', key: 'result_date' },
  { title: '転帰内容', align: 'start', key: 'result' },
  { title: '元資料', align: 'start', key: 'source' }
  /*
  { title: '重症度', align: 'start', key: 'severity' },
  */
]

const expandSearchCard = shallowRef<Number[]>([])
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
const causualFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, causualFilterVal)
}

const resultDateFromFilterVal = shallowRef('')
const resultDateToFilterVal = shallowRef('')
const resultDateFilterFunc = (value: string): boolean => {
  return DateFilterFunc(value, resultDateFromFilterVal, resultDateToFilterVal)
}

const resultFilterVal = shallowRef('')
const resultFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, resultFilterVal)
}

const customKeyFilter = {
  maker: makerFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  lot_no: lotNoFilterFunc,
  age: ageFilterFunc,
  gender: genderFilterFunc,
  date_vaccinated: vaccinatedDateFilterFunc,
  diff: daysToOnsetFilterFunc,
  PT_name: ptNameFilterFunc,
  causual: causualFilterFunc,
  result_date: resultDateFilterFunc,
  result: resultFilterFunc
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
  {name: "rdf", val: resultDateFromFilterVal},
  {name: "rdt", val: resultDateToFilterVal},
  {name: "re", val: resultFilterVal},
]
queryParamMap.forEach(item => {
  const param = pageQueryParams[item.name]
  if(param != undefined) {
    item.val.value = param.toString()
    expandSearchCard.value = [0]
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
  { sm: 4, label: "症状名", model: ptNameFilterVal, type: "text"},
  { sm: 4, label: "因果関係", model: causualFilterVal, type: "text"},
  { sm: 2, label: "転帰日（from）", model: resultDateFromFilterVal, type: "date"},
  { sm: 2, label: "転帰日（to）", model: resultDateToFilterVal, type: "date"},
  { sm: 4, label: "転帰内容", model: resultFilterVal, type: "text"},
]
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

<style>
.expanded-row-style {
  border: medium dashed green;
  background-color: beige !important;
}
</style>
