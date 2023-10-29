<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title color="#00b0ff">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span class="search-title">詳細検索...</span>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <h6 class="text-h6">ワクチンに関する条件の設定</h6>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              label="メーカー"
              v-model="makerFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="ワクチン名"
              v-model="vaccineNameFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="ロット番号"
              v-model="lotNoFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <br />
        <h6 class="text-h6">個人に関する条件の設定</h6>
        <v-row>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="年齢（from）"
              v-model="ageFromFilterVal"
              @input="triggerFunc()"
              type="number"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="年齢（to）"
              v-model="ageToFilterVal"
              @input="triggerFunc()"
              type="number"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="group">
            <v-text-field
              label="性別"
              v-model="genderFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="接種日（from）"
              v-model="vaccinatedDateFromFilterVal"
              @input="triggerFunc()"
              type="date"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="接種日（to）"
              v-model="vaccinatedDateToFilterVal"
              @input="triggerFunc()"
              type="date"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="症状発生日（from）"
              v-model="occurredDateFromFilterVal"
              @input="triggerFunc()"
              type="date"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="症状発生日（to）"
              v-model="occurredDateToFilterVal"
              @input="triggerFunc()"
              type="date"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="group">
            <v-text-field
              label="接種回数"
              v-model="vaccinatedTimesFilterVal"
              @input="triggerFunc()"
              type="number"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="group">
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
    class="data-table-suspect-issues"
    :custom-key-filter="{
      maker: makerFilterFunc,
      vaccine_name: vaccineNameFilterFunc,
      lot_no: lotNoFilterFunc,
      age: ageFilterFunc,
      gender: genderFilterFunc,
      date_vaccinated: vaccinatedDateFilterFunc,
      date_occurred: occurredDateFilterFunc,
      count: vaccinatedTimesFilterFunc,
      basic_disease: preExistingConditionFilterFunc
    }"
  >
    <template v-slot:[`item.maker`]="item">
      <div class="maker-text">{{ item.value }}</div>
    </template>
    <template v-slot:[`item.vaccine_name`]="item">
      <div class="vaccine-name-text">{{ item.value }}</div>
    </template>
    <template v-slot:[`item.date_occurred`]="data">
      <v-expansion-panels
        v-if="String(data.value).split('\n').length > 1"
        v-model="expantionModel"
        multiple
      >
        <v-expansion-panel :value="data.internalItem.raw.no + '-date_occurred'">
          <div v-for="(t, k) in String(data.value).split('\n')" :key="k">
            <v-expansion-panel-title v-if="k == 0">{{ t }}</v-expansion-panel-title>
            <v-expansion-panel-text v-else>{{ t }}</v-expansion-panel-text>
          </div>
          <v-btn @click="expantion(data.internalItem.raw.no)">more..</v-btn>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-slot:[`item.PT`]="data">
      <v-expansion-panels
        v-if="String(data.value).split('\n').length > 1"
        v-model="expantionModel"
        multiple
      >
        <v-expansion-panel :value="data.internalItem.raw.no + '-PT'">
          <div v-for="(t, k) in String(data.value).split('\n')" :key="k">
            <v-expansion-panel-title v-if="k == 0 && !expanded">{{
              t.length > 10 ? t.substring(0, 6) + '...' : t
            }}</v-expansion-panel-title>
            <v-expansion-panel-title v-else-if="k == 0 && expanded">{{
              t
            }}</v-expansion-panel-title>
            <v-expansion-panel-text v-else class="panel-text">{{ t }}</v-expansion-panel-text>
          </div>
          <v-btn @click="expantion(data.internalItem.raw.no)">more..</v-btn>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-slot:[`item.basic_disease`]="data">
      <v-expansion-panels
        v-if="String(data.value).split(';').length > 1"
        v-model="expantionModel"
        multiple
      >
        <v-expansion-panel :value="data.internalItem.raw.no + '-basic_disease'">
          <div v-for="(t, k) in String(data.value).split(';')" :key="k">
            <v-expansion-panel-title v-if="k == 0 && !expanded">{{
              t.length > 10 ? t.substring(0, 6) + '...' : t
            }}</v-expansion-panel-title>
            <v-expansion-panel-title v-else-if="k == 0 && expanded">{{
              t
            }}</v-expansion-panel-title>
            <v-expansion-panel-text v-else class="panel-text">{{ t }}</v-expansion-panel-text>
          </div>
          <v-btn @click="expantion(data.internalItem.raw.no)">more..</v-btn>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { IReportedMyocarditisIssues } from '@/types/ReportedMyocarditis'
import { shallowRef } from 'vue'
import { AppBarTitle, AppBarColor } from '@/router/data'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

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
  if (expantionModel.value.indexOf(no + '-date_occurred') > -1) {
    expantionModel.value = []
    expanded.value = false
    return
  }
  expantionModel.value = [no + '-date_occurred', no + '-PT', no + '-basic_disease']
  expanded.value = true
}

const makerFilterVal = shallowRef('')
const vaccineNameFilterVal = shallowRef('')
const lotNoFilterVal = shallowRef('')
const ageFromFilterVal = shallowRef('')
const ageToFilterVal = shallowRef('')
const genderFilterVal = shallowRef('')
const vaccinatedDateFromFilterVal = shallowRef(null)
const vaccinatedDateToFilterVal = shallowRef(null)
const occurredDateFromFilterVal = shallowRef(null)
const occurredDateToFilterVal = shallowRef(null)
const vaccinatedTimesFilterVal = shallowRef('')
const preExistingConditionFilterVal = shallowRef('')

const triggerFunc = () => {
  // todo: 変化があった入力欄がどれなのかを判別する必要があれば、string型の引数で情報を
  // もらうように変更して対応すればよいと思う。
  trigger()
}

const makerFilterFunc = (value: string): boolean => {
  if (makerFilterVal.value == '') return true
  return value.indexOf(makerFilterVal.value) > -1
}
const vaccineNameFilterFunc = (value: string): boolean => {
  if (vaccineNameFilterVal.value == '') return true
  return value.indexOf(vaccineNameFilterVal.value) > -1
}
const lotNoFilterFunc = (value: string): boolean => {
  if (lotNoFilterVal.value == '') return true
  return value.indexOf(lotNoFilterVal.value) > -1
}
const ageFilterFunc = (value: string): boolean => {
  const v = Number(value)
  // コメントがついているなど数字に変換できないデータの場合は、数字による大小比較が
  // 困難なためフィルタリング時に「非表示」にする
  if (isNaN(v)) return false

  if (ageFromFilterVal.value != '') {
    const f = Number(ageFromFilterVal.value)
    if (v <= f) {
      return false
    }
  }
  if (ageToFilterVal.value != '') {
    const t = Number(ageToFilterVal.value)
    if (v >= t) {
      return false
    }
  }
  return true
}
const genderFilterFunc = (value: string): boolean => {
  if (genderFilterVal.value == '') return true
  return value.indexOf(genderFilterVal.value) > -1
}
const vaccinatedDateFilterFunc = (value: string): boolean => {
  // 改行を含むデータの場合、最初の日付データだけを使ってフィルタリング処理を行う。
  const firstVal = value.split('\n')[0]
  const v = new Date(firstVal)
  // 「不明」の場合など「YYYY/MM/DD」形式でない場合は、Date型に変換しての比較が
  // できないためフィルタリング時に「非表示」にする
  if (isNaN(v.getTime())) return false

  if (vaccinatedDateFromFilterVal.value != null) {
    const f = new Date(vaccinatedDateFromFilterVal.value)
    if (v <= f) {
      return false
    }
  }
  if (vaccinatedDateToFilterVal.value != null) {
    const f = new Date(vaccinatedDateToFilterVal.value)
    if (v >= f) {
      return false
    }
  }
  return true
}
const occurredDateFilterFunc = (value: string): boolean => {
  // 改行を含むデータの場合、最初の日付データだけを使ってフィルタリング処理を行う。
  const firstVal = value.split('\n')[0]
  const v = new Date(firstVal)
  // 「不明」の場合など「YYYY/MM/DD」形式でない場合は、Date型に変換しての比較が
  // できないためフィルタリング時に「非表示」にする
  if (isNaN(v.getTime())) return false

  if (occurredDateFromFilterVal.value != null) {
    const f = new Date(occurredDateFromFilterVal.value)
    if (v <= f) {
      return false
    }
  }
  if (occurredDateToFilterVal.value != null) {
    const f = new Date(occurredDateToFilterVal.value)
    if (v >= f) {
      return false
    }
  }
  return true
}
const vaccinatedTimesFilterFunc = (value: string): boolean => {
  if (vaccinatedTimesFilterVal.value == '' || value == '') return true
  return Number(value.replace('回目', '')) == Number(vaccinatedTimesFilterVal.value)
}
const preExistingConditionFilterFunc = (value: string): boolean => {
  if (preExistingConditionFilterVal.value == '') return true
  return value.indexOf(preExistingConditionFilterVal.value) > -1
}

defineProps<{
  items: IReportedMyocarditisIssues
}>()

let headers: any
headers = [
  { title: 'メーカー', align: 'end', key: 'maker' },
  { title: 'ワクチン名', align: 'end', key: 'vaccine_name' },
  { title: 'ロット番号', align: 'end', key: 'lot_no' },
  { title: '年齢', align: 'end', key: 'age' },
  { title: '性別', align: 'end', key: 'gender' },
  { title: '接種日', align: 'end', key: 'date_vaccinated' },
  { title: '症状発生日', align: 'end', key: 'date_occurred' },
  { title: '症状名', align: 'end', key: 'PT' },
  { title: '接種回数', align: 'end', key: 'count' },
  { title: '基礎疾患', align: 'end', key: 'basic_disease' },
  { title: '評価', align: 'end', key: 'evaluation' }
  /*
  { title: 'No', align: 'end', key: 'no' },
  */
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
