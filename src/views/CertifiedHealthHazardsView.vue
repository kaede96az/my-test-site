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
          <v-col v-for="sItem, i in issueSearchItems" :key="i" cols="12" :sm="sItem.sm" class="group">

            <v-select v-if="sItem.type == 'reasons'"
             v-model="reasonsForRepudiationValues"
             :items="reasonsForRepudiationItems"
             :label="sItem.label" multiple
             @update:model-value="searchTrigerFunc"
             >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 2">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ reasonsForRepudiationValues.length - 2 }} others)
                </span>
              </template>
            </v-select>

            <v-dialog v-else-if="sItem.type == 'reasons-help'" transition="dialog-bottom-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-help-circle-outline" v-bind="props">否認理由について...</v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="否認理由について">
                  <v-card-text>
                    2023年2月10日 以前の報告では、否認理由は下図のように5段階で分けられていました。
                  </v-card-text>
                  <v-img src="TypeA.png"></v-img>

                  <v-card-text>
                    しかし、2023年3月14日 以降の報告では、否認理由は下図の4段階で表現されるようになりました。
                  </v-card-text>
                  <v-img src="TypeB.png"></v-img>

                  <v-card-text>
                    それぞれの数字が表す内容が異なるため、本サイトではタイプを表す文字列をつけて区別するようにしました。
                    <ul>
                      <li>2023年2月10日 以前: TypeA-</li>
                      <li>2023年3月14日 以降: TypeB-</li>
                    </ul>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      text="閉じる"
                      @click="isActive.value = false"
                    >閉じる</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>

            <v-text-field v-else
              :label="sItem.label"
              v-model="sItem.model.value"
              :type="sItem.type"
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
    <template v-slot:[`item.age`]="item">
      <span>{{ item.value.join(', ') }}</span>
    </template>

    <template v-slot:[`item.symptoms`]="item">
      <SymptomsRow :symptoms="item.value"></SymptomsRow>
    </template>

    <template v-slot:[`item.description_of_claim`]="item">
      <BillingDetailsChip :description_of_claim="item.value"></BillingDetailsChip>
    </template>

    <template v-slot:[`item.pre_existing_conditions`]="item">
      <BasicDiseaseRow :pre_existing_conditions="item.value"></BasicDiseaseRow>
    </template>

    <template v-slot:[`item.reasons_for_repudiation`]="item">
      <span>{{ item.value.join(', ') }}</span>
    </template>

    <template v-slot:[`item.source_url`]="item">
      <a :href="item.value">リンク</a>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row>
          <v-col cols="12" md="6">
            <SymptomsCard :symptoms="item.symptoms" :click-close="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"></SymptomsCard>
          </v-col>
          <v-col cols="12" md="6">
            <BasicDiseaseCard :pre_existing_conditions="item.pre_existing_conditions"></BasicDiseaseCard>
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
import { DateFilterFunc, StringFilterFunc, StringArrayFilterFunc, NumberArrayFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { ShallowRef } from 'vue'
import BasicDiseaseRow from '@/components/BasicDiseaseRow.vue'
import BasicDiseaseCard from '@/components/BasicDiseaseCard.vue'
import SymptomsRow from '@/components/SymptomsRow.vue'
import SymptomsCard from '@/components/SymptomsCard.vue'
import BillingDetailsChip from '@/components/BillingDetailsChip.vue'
import type { IQueryParamWithArray } from '@/types/QueryParam'
import { CreateUrlWithQueryParams } from '@/types/QueryParam'
import { CreateCsvContent, CreateFilteredData, DownloadCsvFile, FilterType, type IKeyAndFilter } from '@/types/FilteredDataAsCsv'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'green'

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
  { title: '認定日', align: 'start', key: 'certified_date', width: 120 },
  { title: '性別', align: 'start', key: 'gender', width: 25},
  { title: '年齢', align: 'start', key: 'age', width: 25 },
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 110 },
  { title: '請求内容', align: 'start', key: 'description_of_claim', width: 170 },
  { title: '症状', align: 'start', key: 'symptoms' },
  { title: '基礎疾患', align: 'start', key: 'pre_existing_conditions' },
  { title: '判定', align: 'start', key: 'judgment_result', width: 25 },
  { title: '否認理由', align: 'start', key: 'reasons_for_repudiation', width: 110 },
  { title: '元資料', align: 'start', key: 'source_url', width: 100},
]

const expandedArray = shallowRef<string[]>([])

const vaccineNameFilterVal = shallowRef('')
const vaccineNameFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, vaccineNameFilterVal)
}

const symptomsFilterVal = shallowRef('')
const symptomsFilterFunc = (values: any): boolean => {
  return StringArrayFilterFunc(values, symptomsFilterVal)
}

const descriptionOfClaimFilterVal = shallowRef('')
const descriptionOfClaimFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, descriptionOfClaimFilterVal)
}

const judgmentResultFilterVal = shallowRef('')
const judgmentResultFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, judgmentResultFilterVal)
}

const certifiedDateFromFilterVal = shallowRef('')
const certifiedDateToFilterVal = shallowRef('')
const certifiedDateFilterFunc = (value: string): boolean => {
  return DateFilterFunc(value, certifiedDateFromFilterVal, certifiedDateToFilterVal)
}

// todo: 本当はnumber型にしたいのだが、検索入力の関係で空文字やnullも入る
// それらも考慮した型にすると今度は別の箇所でエラーが・・
// という事情から、anyを使用
const ageFromFilterVal = shallowRef<any>('')
const ageToFilterVal = shallowRef<any>('')
const ageFilterFunc = (values: any): boolean => {
  return NumberArrayFilterFunc(values, ageFromFilterVal, ageToFilterVal)
}

const genderFilterVal = shallowRef('')
const genderFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, genderFilterVal)
}

const preExistingConditionFilterVal = shallowRef('')
const preExistingConditionFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, preExistingConditionFilterVal)
}

const reasonsForRepudiationItems = ['TypeA-1', 'TypeA-2', 'TypeA-3', 'TypeA-4', 'TypeA-5', 'TypeB-1', 'TypeB-2', 'TypeB-3', 'TypeB-4']
const reasonsForRepudiationValues = shallowRef<any>([])
const reasonsForRepudiationFilterFunc = (value: any): boolean => {
  if(reasonsForRepudiationValues.value.length == 0) return true
  if(value.length == 0) return false // 検索しようとしているが対象列の内容が空っぽの場合なので非表示

  for (let index = 0; index < value.length; index++) {
    if(reasonsForRepudiationValues.value.indexOf(value[index]) > -1){
      return true
    }
  }

  return false
}

const customKeyFilter = {
  certified_date: certifiedDateFilterFunc,
  gender: genderFilterFunc,
  age: ageFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  description_of_claim: descriptionOfClaimFilterFunc,
  symptoms: symptomsFilterFunc,
  judgment_result: judgmentResultFilterFunc,
  pre_existing_conditions: preExistingConditionFilterFunc,
  reasons_for_repudiation: reasonsForRepudiationFilterFunc
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
const queryParamMap: IQueryParamWithArray[] = [
  {name: "vn", val: vaccineNameFilterVal, isArray: false},
  {name: "sym", val: symptomsFilterVal, isArray: false},
  {name: "tp", val: descriptionOfClaimFilterVal, isArray: false},
  {name: "re", val: judgmentResultFilterVal, isArray: false},
  {name: "cdf", val: certifiedDateFromFilterVal, isArray: false},
  {name: "cdt", val: certifiedDateToFilterVal, isArray: false},
  {name: "adf", val: ageFromFilterVal, isArray: false},
  {name: "adt", val: ageToFilterVal, isArray: false},
  {name: "gen", val: genderFilterVal, isArray: false},
  {name: "pre", val: preExistingConditionFilterVal, isArray: false},
  {name: "rea", val: reasonsForRepudiationValues, isArray: true}
]
queryParamMap.forEach(item => {
  const param = pageQueryParams[item.name]
  if(param != undefined) {
    if(item.isArray){
      const paramArray = param.toString().split(',')
      for (let index = 0; index < paramArray.length; index++) {
        item.val.value.push(paramArray[index])
      }
    } else {
      item.val.value = param.toString()
      searchConditionChanged.value = true
    }
  }
});
const copyUrlWithQueryParams = () => {
  const retUrl = CreateUrlWithQueryParams(queryParamMap)
  if(navigator.clipboard){
    navigator.clipboard.writeText(retUrl);
  }
}

const issueSearchItems = [
  { sm: 6, label: "請求内容", model: descriptionOfClaimFilterVal, type: "text"},
  { sm: 6, label: "症状", model: symptomsFilterVal, type: "text"},
  { sm: 1, label: "判定", model: judgmentResultFilterVal, type: "text"},
  { sm: 3, label: "否認理由（いずれかに合致）", model: shallowRef() , type: "reasons"},
  { sm: 2, label: "", model: shallowRef() , type: "reasons-help"},
  { sm: 3, label: "認定日（from）", model: certifiedDateFromFilterVal, type: "date"},
  { sm: 3, label: "認定日（to）", model: certifiedDateToFilterVal, type: "date"},
]
const individualSearchItems = [
  { sm: 2, label: "年齢（from）", model: ageFromFilterVal, type: "number"},
  { sm: 2, label: "年齢（to）", model: ageToFilterVal, type: "number"},
  { sm: 4, label: "性別", model: genderFilterVal, type: "text"},
  { sm: 4, label: "基礎疾患", model: preExistingConditionFilterVal, type: "text"},
]

const keyAndFilterMap: IKeyAndFilter[] = [
  { key: "certified_date", filterType: FilterType.Date , valFilter: shallowRef(''), fromFilter: certifiedDateFromFilterVal, toFilter: certifiedDateToFilterVal},
  { key: "age", filterType: FilterType.NumberArray , valFilter: shallowRef(''), fromFilter: ageFromFilterVal, toFilter: ageToFilterVal},
  { key: "gender", filterType: FilterType.String , valFilter: genderFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "vaccine_name", filterType: FilterType.String , valFilter: vaccineNameFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "description_of_claim", filterType: FilterType.String , valFilter: descriptionOfClaimFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "symptoms", filterType: FilterType.StringArray , valFilter: symptomsFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "pre_existing_conditions", filterType: FilterType.StringArray , valFilter: preExistingConditionFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
  { key: "judgment_result", filterType: FilterType.StringArray , valFilter: judgmentResultFilterVal, fromFilter: shallowRef(''), toFilter: shallowRef('')},
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
