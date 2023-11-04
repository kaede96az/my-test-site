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
  </v-expansion-panels>
  <br />

  <v-data-table
    loading-text="データを読み込み中です。"
    :loading="loading"
    :items="items as any"
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
import type { ICertifiedHealthHazardIssues } from '@/types/CertifiedHealthHazard'
import { NumberFilterFunc, DateFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { ShallowRef } from 'vue'
import BasicDiseaseRow from '@/components/BasicDiseaseRow.vue'
import BasicDiseaseCard from '@/components/BasicDiseaseCard.vue'
import SymptomsRow from '@/components/SymptomsRow.vue'
import SymptomsCard from '@/components/SymptomsCard.vue'
import BillingDetailsChip from '@/components/BillingDetailsChip.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#4CAF50'

const loading = shallowRef(true)
const items = shallowRef<ICertifiedHealthHazardIssues>()
onMounted(() => {
  axios
    .get<ICertifiedHealthHazardIssues>(CertifiedHealthHazardDataURL)
    .then((response) => {
      items.value = response.data
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
  { title: '理由', align: 'start', key: 'reason' },
  { title: '認定日', align: 'start', key: 'approved_date' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '基礎疾患', align: 'start', key: 'basic_disease' }
]

const expandSearchCard = shallowRef<Number[]>([])
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

const symptomQuery = router.currentRoute.value.query.symptom
console.log('symptomQuery is ' + symptomQuery)
if(symptomQuery != undefined){
  symptomsFilterVal.value = symptomQuery.toString()
  expandSearchCard.value = [0]
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
