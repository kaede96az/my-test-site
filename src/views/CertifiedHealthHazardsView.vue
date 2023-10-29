<template>
  <v-container fluid>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title color="#66BB6A">
          <v-icon class="search-icon">mdi-magnify</v-icon>
          <span class="search-title">詳細検索...</span>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <h6 class="text-h6">症状など申請に関する条件の設定</h6>
          <v-row>
            <v-col cols="12" sm="3" class="group">
              <v-text-field
                label="ワクチン名"
                v-model="vaccineNameFilterVal"
                @input="triggerFunc()"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" class="group">
              <v-text-field
                label="判定"
                v-model="resultFilterVal"
                @input="triggerFunc()"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="group">
              <v-text-field
                label="症状"
                v-model="symptomsFilterVal"
                @input="triggerFunc()"
                clearable
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="3" class="group">
              <v-text-field
                label="認定日（from）"
                v-model="certifiedDateFromFilterVal"
                @input="triggerFunc()"
                type="date"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" class="group">
              <v-text-field
                label="認定日（to）"
                v-model="certifiedDateToFilterVal"
                @input="triggerFunc()"
                type="date"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="group">
              <v-text-field
                label="請求内容"
                v-model="billingTypeFilterVal"
                @input="triggerFunc()"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <br />
          <h6 class="text-h6">個人に関する条件の設定</h6>
          <v-row>
            <v-col cols="12" sm="2" class="group">
              <v-text-field
                label="年齢（from）"
                v-model="ageFromFilterVal"
                @input="triggerFunc()"
                type="number"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="2" class="group">
              <v-text-field
                label="年齢（to）"
                v-model="ageToFilterVal"
                @input="triggerFunc()"
                type="number"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" class="group">
              <v-text-field
                label="性別"
                v-model="genderFilterVal"
                @input="triggerFunc()"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" class="group">
              <v-text-field
                label="基礎疾患"
                v-model="preExistingConditionFilterVal"
                @input="triggerFunc()"
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
      :items="items as any"
      :headers="headers"
      :search="searchTrigger"
      :custom-filter="
        () => {
          return true
        }
      "
      density="compact"
      class="data-table-health-hazard"
      :custom-key-filter="{
        vaccine_name: vaccineNameFilterFunc,
        name: symptomsFilterFunc,
        type: billingTypeFilterFunc,
        result: resultFilterFunc,
        approved_date: certifiedDateFilterFunc,
        age: ageFilterFunc,
        gender: genderFilterFunc,
        basic_disease: preExistingConditionFilterFunc
      }"
    >
      <template v-slot:[`item.vaccine_name`]="item">
        <span>{{ item.value }}</span>
      </template>

      <template v-slot:[`item.basic_disease`]="data">
        <v-expansion-panels v-if="String(data.value).length > 1" v-model="expantionModel" multiple>
          <v-expansion-panel :value="getUniqueKey(data) + '-basic_disease'">
            <div v-for="(t, k) in String(data.value).split('、')" :key="k">
              <v-expansion-panel-title v-if="k == 0 && !expanded">{{
                t.length > 10 ? t.substring(0, 6) + '...' : t
              }}</v-expansion-panel-title>
              <v-expansion-panel-title v-else-if="k == 0 && expanded">{{
                t
              }}</v-expansion-panel-title>
              <v-expansion-panel-text v-else class="panel-text">{{ t }}</v-expansion-panel-text>
            </div>
            <v-btn @click="expantion(getUniqueKey(data))">more..</v-btn>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, CertifiedHealthHazardDataURL } from '@/router/data'
import type { ICertifiedHealthHazardIssues } from '@/types/CertifiedHealthHazard'
import { NumberFilterFunc, DateFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#4CAF50'

const items = shallowRef<ICertifiedHealthHazardIssues>()
onMounted( () => {
  axios.get<ICertifiedHealthHazardIssues>(CertifiedHealthHazardDataURL)
  .then(response => items.value = response.data)
  .catch(error => console.log('failed to get certified heallth hazard data: ' + error))
})

// searchになにか文字を指定することでv-data-tableのfilterが実行されるようにする。（空文字だとフィルタリングがOffになる）
// custom-filterの処理は常にtrueを返すように上書きして、search文字列によるフィルタリング処理が行われないようにする。
// custom-key-filterの設定は、keyに対応する列のアイテムに対して指定の関数をフィルタリング処理として使う。
// custom-key-filterは、すべての列に対して設定すると、すべての処理でtrueを返していても「No data available」表示になるので注意。
const searchTrigger = shallowRef('a')
const trigger = () => {
  searchTrigger.value = searchTrigger.value == 'a' ? 'b' : 'a'
}

let expantionModel = shallowRef([''])
const expanded = shallowRef(false)
const expantion = (no: string) => {
  if (expantionModel.value.indexOf(no + '-basic_disease') > -1) {
    expantionModel.value = []
    expanded.value = false
    return
  }
  expantionModel.value = [no + '-basic_disease']
  expanded.value = true
}
const getUniqueKey = (data: any): string => {
  return (
    data.internalItem.raw.age +
    '-' +
    data.internalItem.raw.gender +
    '-' +
    data.internalItem.raw.approved_date
  )
}

const triggerFunc = () => {
  // todo: 変化があった入力欄がどれなのかを判別する必要があれば、string型の引数で情報を
  // もらうように変更して対応すればよいと思う。
  trigger()
}

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

let headers: any
headers = [
  { title: 'ワクチン名', align: 'end', key: 'vaccine_name' },
  { title: '症状', align: 'end', key: 'name' },
  { title: '請求内容', align: 'end', key: 'type' },
  { title: '判定', align: 'end', key: 'result' },
  { title: '理由', align: 'end', key: 'reason' },
  { title: '認定日', align: 'end', key: 'approved_date' },
  { title: '年齢', align: 'end', key: 'age' },
  { title: '性別', align: 'end', key: 'gender' },
  { title: '基礎疾患', align: 'end', key: 'basic_disease' }
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
