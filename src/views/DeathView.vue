<template>
  <v-expansion-panels color="#00b0ff">
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
          <v-col cols="12" sm="6" class="group">
            <v-text-field
              label="症状"
              v-model="causeFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="group">
            <v-text-field
              label="因果関係"
              v-model="causalRelFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
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
    color="#00b0ff"
    :items="items as any"
    :headers="headers"
    :search="searchTrigger"
    :custom-filter="
      () => {
        return true
      }
    "
    density="compact"
    class="data-table-style"
    :custom-key-filter="{
      maker: makerFilterFunc,
      vaccine_name: vaccineNameFilterFunc,
      lot_no: lotNoFilterFunc,
      cause: causeFilterFunc,
      causual_relationship: causalRelFilterFunc,
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
    <template v-slot:[`item.basic_disease`]="item">
      <v-btn v-if="String(item.value).length > 10" class="detail-button">
        {{ String(item.value).substring(0, 6) + '...' }}
        <v-tooltip
          activator="parent"
          location="bottom"
          :open-on-hover="true"
          :open-on-click="true"
          >{{ item.value }}</v-tooltip
        >
      </v-btn>
      <span v-else>{{ item.value }}</span>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { IReportedDeathIssues } from '@/types/ReportedDeath'
import { shallowRef } from 'vue'
import { AppBarTitle, AppBarColor } from '@/router/data'

AppBarTitle.value = '副反応疑い報告 - 死亡報告'
AppBarColor.value = '#2962ff'

// searchになにか文字を指定することでv-data-tableのfilterが実行されるようにする。（空文字だとフィルタリングがOffになる）
// custom-filterの処理は常にtrueを返すように上書きして、search文字列によるフィルタリング処理が行われないようにする。
// custom-key-filterの設定は、keyに対応する列のアイテムに対して指定の関数をフィルタリング処理として使う。
const searchTrigger = shallowRef('a')
const trigger = () => {
  searchTrigger.value = searchTrigger.value == 'a' ? 'b' : 'a'
}

const makerFilterVal = shallowRef('')
const vaccineNameFilterVal = shallowRef('')
const lotNoFilterVal = shallowRef('')
const causeFilterVal = shallowRef('')
const causalRelFilterVal = shallowRef('')
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
const causeFilterFunc = (value: string): boolean => {
  if (causeFilterVal.value == '') return true
  return value.indexOf(causeFilterVal.value) > -1
}
const causalRelFilterFunc = (value: string): boolean => {
  if (causalRelFilterVal.value == '') return true
  return value.indexOf(causalRelFilterVal.value) > -1
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
  const v = new Date(value)
  // ワクチン接種日が「不明」の場合や、改行・注記など含んでいて「YYYY/MM/DD」形式でない場合は
  // Date型に変換しての比較が困難なためフィルタリング時に「非表示」にする
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
  const v = new Date(value)
  // 症状発生日が「不明」の場合や、改行・注記など含んでいて「YYYY/MM/DD」形式でない場合は
  // Date型に変換しての比較が困難なためフィルタリング時に「非表示」にする
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
  items: IReportedDeathIssues
}>()

const sortable = shallowRef('false')

let headers: any = [
  { title: 'メーカー', align: 'end', key: 'maker', sortable: false },
  { title: 'ワクチン名', align: 'end', key: 'vaccine_name', sortable: false },
  { title: 'ロット番号', align: 'end', key: 'lot_no', sortable: false },
  { title: '症状', align: 'end', key: 'cause', sortable: false },
  { title: '因果関係', align: 'end', key: 'causual_relationship', sortable: false },
  { title: '年齢', align: 'end', key: 'age', sortable: false },
  { title: '性別', align: 'end', key: 'gender', sortable: false },
  { title: '接種日', align: 'end', key: 'date_vaccinated', sortable: false },
  { title: '症状発生日', align: 'end', key: 'date_occurred', sortable: false },
  { title: '接種回数', align: 'end', key: 'count', sortable: false },
  { title: '基礎疾患', align: 'end', key: 'basic_disease', sortable: false },
  { title: '検査方法', align: 'end', key: 'method', sortable: false }
  /*
  { title: 'No', align: 'end', key: 'no' },
  { title: 'PT名', align: 'end', key: 'PT' },
  { title: 'other_possibility', align: 'end', key: 'other_possibility' },
  { title: '評価1', align: 'end', key: 'evaluation1' },
  { title: 'コメント1', align: 'end', key: 'comment1' },
  { title: '評価2', align: 'end', key: 'evaluation2' },
  { title: 'コメント2', align: 'end', key: 'comment2' },
  { title: '文書番号', align: 'end', key: 'document_no' },
  { title: 'case_no', align: 'end', key: 'case_no' },
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

.detail-button {
  width: 10rem;
}
.search-icon {
  font-size: 2rem;
}
.search-title {
  font-size: 1.5rem;
  padding-left: 0.8rem;
}
</style>
