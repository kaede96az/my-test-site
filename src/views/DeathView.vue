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
      <SearchRelatedToolBar btn-color="blue-darken-3" :copy-func="copyUrlWithQueryParams" :download-func="downloadFilteredDataAsCsv" :clear-func="clearFilter"></SearchRelatedToolBar>
    </v-expansion-panel>

  </v-expansion-panels>
  <br />

  <v-data-table
    loading-text="データを読み込み中です。"
    :loading="loading"
    color="#00b0ff"
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
    item-value="id"
    v-model:expanded="expandedArray"
    :custom-key-filter="customKeyFilter"
  >
    <template v-slot:[`item.manufacturer`]="item">
      <div class="maker-text">{{ item.value }}</div>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <div class="vaccine-name-text">{{ item.value }}</div>
    </template>

    <template v-slot:[`item.onset_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.causal_relationship_by_expert`]="item">
      <CausualRelationshipRow :CR="item.value"></CausualRelationshipRow>
    </template>

    <template v-slot:[`item.PT_names`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.pre_existing_conditions`]="item">
      <StringRow :content="item.value"></StringRow>
    </template>

    <template v-slot:[`item.comments_by_expert`]="item">
      <StringRow :content="item.value"></StringRow>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row cols="12" md="6">
          <v-col>
            <DeathDetail
            :no="item.no"
            :vaccinated_dates="item.vaccinated_dates"
            :onset_dates="item.onset_dates"
            :PT_names="item.PT_names"
            :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.id )}"
            ></DeathDetail>
          </v-col>

          <v-col cols="12" md="6">
            <PreExistingDiseaseCard title="基礎疾患等" :pre_existing_disease_names="item.pre_existing_conditions.split('\n')"></PreExistingDiseaseCard>
          </v-col>

          <v-col cols="12">
            <v-card variant="elevated" color="blue-grey-darken-1">
              <v-card-title>専門家のコメント</v-card-title>
              <v-card-text>{{ item.comments_by_expert }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </td>
    </template>

  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import type { IReportedDeathIssue } from '@/types/ReportedDeath'
import { AppBarTitle, AppBarColor, DeathReportsURL } from '@/router/data'
import { NumberFilterFunc, DateFilterFunc, StringFilterFunc, DateArrayFilterFunc, StringArrayFilterFunc } from '@/tools/FilterFunc'
import router from '@/router/index'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import StringRow from '@/components/StringRow.vue'
import StringArrayRow from '@/components/StringArrayRow.vue'
import DatesRow from '@/components/DatesRow.vue'
import DeathDetail from '@/components/DeathDetail.vue'
import PreExistingDiseaseCard from '@/components/PreExistingDiseaseCard.vue'
import CausualRelationshipRow from '@/components/CausualRelationshipRow.vue'
import type { ShallowRef } from 'vue'
import type { IQueryParam } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'
import { CreateCsvContent, CreateFilteredData, DownloadCsvFile, FilterType, type IKeyAndFilter } from '@/types/FilteredDataAsCsv'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IReportedDeathIssue[]>()
onMounted(() => {
  axios
    .get<IReportedDeathIssue[]>(DeathReportsURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get death data: ' + error))
})

let headers = [
  { key: 'data-table-expand', width: 20 },
  { title: 'No', align: 'start', key: 'no' },
  { title: '製造販売業者', align: 'start', key: 'manufacturer'},
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '接種日', align: 'start', key: 'vaccinated_dates' },
  { title: '死亡日', align: 'start', key: 'onset_dates' },
  { title: 'ロット番号', align: 'start', key: 'lot_no' },
  { title: '接種回数', align: 'start', key: 'vaccinated_times' },
  { title: '基礎疾患等', align: 'start', key: 'pre_existing_conditions' },
  { title: '死因(MedDRA PT)', align: 'start', key: 'PT_names' },
  { title: '専門家の因果関係評価', align: 'start', key: 'causal_relationship_by_expert', width: 100 },
  { title: '専門家のコメント', align: 'end', key: 'comments_by_expert' },
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

const ptFilterVal = shallowRef('')
const ptFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, ptFilterVal)
}

const causalRelFilterVal = shallowRef('')
const causalRelFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, causalRelFilterVal)
}

const occurredDateFromFilterVal = shallowRef('')
const occurredDateToFilterVal = shallowRef('')
const occurredDateFilterFunc = (value: any): boolean => {
  return DateArrayFilterFunc(value, occurredDateFromFilterVal, occurredDateToFilterVal)
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

const customKeyFilter = {
  manufacturer: makerFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  age: ageFilterFunc,
  gender: genderFilterFunc,
  vaccinated_dates: vaccinatedDateFilterFunc,
  onset_dates: occurredDateFilterFunc,
  lot_no: lotNoFilterFunc,
  vaccinated_times: vaccinatedTimesFilterFunc,
  pre_existing_conditions: preExistingConditionFilterFunc,
  PT_names: ptFilterFunc,
  causal_relationship_by_expert: causalRelFilterFunc,
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
  {name: "adf", val: ageFromFilterVal},
  {name: "adt", val: ageToFilterVal},
  {name: "gen", val: genderFilterVal},
  {name: "vdf", val: vaccinatedDateFromFilterVal},
  {name: "vdt", val: vaccinatedDateToFilterVal},
  {name: "odf", val: occurredDateFromFilterVal},
  {name: "odt", val: occurredDateToFilterVal},
  {name: "ln", val: lotNoFilterVal},
  {name: "vtf", val: vaccinatedTimesFromFilterVal},
  {name: "vtt", val: vaccinatedTimesToFilterVal},
  {name: "pre", val: preExistingConditionFilterVal},
  {name: "pt", val: ptFilterVal},
  {name: "cr", val: causalRelFilterVal},
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
  { sm: 2, label: "死亡日（from）", model: occurredDateFromFilterVal, type: "date"},
  { sm: 2, label: "死亡日（to）", model: occurredDateToFilterVal, type: "date"},
  { sm: 2, label: "接種回数（from）", model: vaccinatedTimesFromFilterVal, type: "number"},
  { sm: 2, label: "接種回数（to）", model: vaccinatedTimesToFilterVal, type: "number"},
  { sm: 4, label: "基礎疾患等", model: preExistingConditionFilterVal, type: "text"},
  { sm: 4, label: "死因(MedDRA PT)", model: ptFilterVal, type: "text"},
  { sm: 2, label: "専門家の因果関係評価", model: causalRelFilterVal, type: "text"},
]

const _blank = shallowRef('')
const keyAndFilterMap: IKeyAndFilter[] = [
  { key: "no", filterType: FilterType.String , valFilter: _blank, fromFilter: _blank, toFilter: _blank},
  { key: "manufacturer", filterType: FilterType.String , valFilter: makerFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "vaccine_name", filterType: FilterType.String , valFilter: vaccineNameFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "age", filterType: FilterType.Number , valFilter: _blank, fromFilter: ageFromFilterVal, toFilter: ageToFilterVal},
  { key: "gender", filterType: FilterType.String , valFilter: genderFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "vaccinated_dates", filterType: FilterType.Date , valFilter: _blank, fromFilter: vaccinatedDateFromFilterVal, toFilter: vaccinatedDateToFilterVal},
  { key: "onset_dates", filterType: FilterType.DateArray , valFilter: _blank, fromFilter: occurredDateFromFilterVal, toFilter: occurredDateToFilterVal},
  { key: "lot_no", filterType: FilterType.String , valFilter: lotNoFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "vaccinated_times", filterType: FilterType.Number , valFilter: _blank, fromFilter: vaccinatedTimesFromFilterVal, toFilter: vaccinatedTimesToFilterVal},
  { key: "pre_existing_conditions", filterType: FilterType.String , valFilter: preExistingConditionFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "PT_names", filterType: FilterType.StringArray , valFilter: ptFilterVal, fromFilter: _blank, toFilter: _blank},
  { key: "causal_relationship_by_expert", filterType: FilterType.String , valFilter: causalRelFilterVal, fromFilter: _blank, toFilter: _blank},
]
const downloadFilteredDataAsCsv = () => {
  const filteredData = CreateFilteredData<IReportedDeathIssue>(keyAndFilterMap, dataTableItems)
  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContent<IReportedDeathIssue>(filteredData, headerTitles, headerKeys)

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

.detail-tile {
  height: 100%;
}
</style>
