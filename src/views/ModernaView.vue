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
              label="症状名"
              v-model="ptNameFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="group">
            <v-text-field
              label="重症度"
              v-model="severityFilterVal"
              @input="triggerFunc()"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="転帰日（from）"
              v-model="resultDateFromFilterVal"
              @input="triggerFunc()"
              type="date"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="group">
            <v-text-field
              label="転帰日（to）"
              v-model="resultDateToFilterVal"
              @input="triggerFunc()"
              type="date"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="group">
            <v-text-field
              label="転帰内容"
              v-model="resultFilterVal"
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
    loading-text="データを読み込み中です。"
    :loading="loading"
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
    show-expand
    expand-on-click
    item-value="no"
    v-model:expanded="expandedArray"
    :custom-key-filter="{
      maker: makerFilterFunc,
      vaccine_name: vaccineNameFilterFunc,
      lot_no: lotNoFilterFunc,
      age: ageFilterFunc,
      gender: genderFilterFunc,
      date_vaccinated: vaccinatedDateFilterFunc,
      date_occurred: occurredDateFilterFunc,
      PT_name: ptNameFilterFunc,
      severity: severityFilterFunc,
      result_date: resultDateFilterFunc,
      result: resultFilterFunc
    }"
  >
    <template v-slot:[`item.maker`]="item">
      <span class="maker-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <span class="vaccine-name-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.PT_name`]="item">
      <span v-if="item.value.length > 10">{{ item.value.substring(0, 7) + '...' }}</span>
      <span v-else>{{ item.value }}</span>
    </template>

    <template v-slot:[`item.date_occurred`]="item">
      <span v-if="item.value.split(delimiters).length > 1">{{
        item.value.split(delimiters)[0] + '...'
      }}</span>
      <span v-else>{{ item.value }}</span>
    </template>

    <template v-slot:[`item.result_date`]="item">
      <span
        v-if="
          item.value.split(delimiters).length > 1 && item.value.split(delimiters)[0].length >= 10
        "
        >{{ item.value.split(delimiters)[0].substring(0, 10) + '...' }}</span
      >
      <span
        v-else-if="
          item.value.split(delimiters).length > 1 && item.value.split(delimiters)[0].length < 9
        "
        >{{ item.value.split(delimiters)[0] + '...' }}</span
      >
      <span v-else-if="item.value.length >= 10 && item.value.indexOf('/') > -1">{{
        item.value.substring(0, 10) + '...'
      }}</span>
      <span v-else-if="item.value.length >= 6 && item.value.indexOf('/') == -1">{{
        item.value.substring(0, 6) + '...'
      }}</span>
      <span v-else>{{ item.value }}</span>
    </template>

    <template v-slot:[`item.result`]="item">
      <span
        v-if="
          item.value.split(delimiters).length > 1 && item.value.split(delimiters)[0].length >= 10
        "
        >{{ item.value.split(delimiters)[0].substring(0, 7) + '...' }}</span
      >
      <span
        v-else-if="
          item.value.split(delimiters).length > 1 && item.value.split(delimiters)[0].length < 9
        "
        >{{ item.value.split(delimiters)[0] }}</span
      >
      <span v-else-if="item.value.length >= 10">{{ item.value.substring(0, 7) + '...' }}</span>
      <span v-else>{{ item.value }}</span>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-card variant="elevated" color="blue-grey-darken-1">
          <v-card-title>症状と経過の詳細（No. {{ item.no }}）</v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="(day, i) in item.date_occurred.split(delimiters)" :key="day + '-' + i">
                <v-timeline density="compact" align="start">
                  <v-timeline-item dot-color="orange" size="x-small">
                    <div class="mb-4">
                      <div class="font-weight-normal">
                        <strong>{{ day }}</strong
                        >： {{ item.PT_name.split(delimiters)[i] }}）
                      </div>
                    </div>
                  </v-timeline-item>

                  <v-timeline-item
                    :dot-color="getTimeLineColor(item.result.split(delimiters)[i])"
                    size="x-small"
                  >
                    <div class="mb-4">
                      <div class="font-weight-normal">
                        <strong>{{ item.result_date.split(delimiters)[i] }}</strong
                        >： {{ item.result.split(delimiters)[i] }}
                      </div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            ><v-btn variant="outlined" @click="expandedArray = []"
              >詳細表示を閉じる</v-btn
            ></v-card-actions
          >
        </v-card>
      </td>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, ReportedModernaDataURL } from '@/router/data'
import { DateFilterFunc, NumberFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import type { IReportedModernaIssues } from '@/types/Moderna'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const loading = shallowRef(true)
const items = shallowRef<IReportedModernaIssues>()
onMounted(() => {
  axios
    .get<IReportedModernaIssues>(ReportedModernaDataURL)
    .then((response) => {
      items.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get reported moderna data: ' + error))
})

const delimiters = /[,、）\n]+/

// searchになにか文字を指定することでv-data-tableのfilterが実行されるようにする。（空文字だとフィルタリングがOffになる）
// custom-filterの処理は常にtrueを返すように上書きして、search文字列によるフィルタリング処理が行われないようにする。
// custom-key-filterの設定は、keyに対応する列のアイテムに対して指定の関数をフィルタリング処理として使う。
// custom-key-filterは、すべての列に対して設定すると、すべての処理でtrueを返していても「No data available」表示になるので注意。
const searchTrigger = shallowRef('a')
const trigger = () => {
  searchTrigger.value = searchTrigger.value == 'a' ? 'b' : 'a'
}

const triggerFunc = () => {
  // todo: 変化があった入力欄がどれなのかを判別する必要があれば、string型の引数で情報を
  // もらうように変更して対応すればよいと思う。
  trigger()
}

let expandedArray = shallowRef([])
const getTimeLineColor = (result: string): string => {
  switch (result) {
    case '回復':
      return 'green'
    case '軽快':
      return 'lime'
    case '未回復':
      return 'orange'
    case '後遺症あり':
      return 'pink-darken-4'
    case '死亡':
      return 'red'

    default:
      return 'grey'
  }
}

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

const occurredDateFromFilterVal = shallowRef('')
const occurredDateToFilterVal = shallowRef('')
const occurredDateFilterFunc = (value: string): boolean => {
  return DateFilterFunc(value, occurredDateFromFilterVal, occurredDateToFilterVal)
}

const ptNameFilterVal = shallowRef('')
const ptNameFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, ptNameFilterVal)
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
const resultFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, resultFilterVal)
}

let headers: any
headers = [
  { key: 'data-table-expand', width: 20 },
  { title: 'No.', align: 'start', key: 'no' },
  { title: 'メーカー', align: 'start', key: 'maker' },
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 200 },
  { title: 'ロット番号', align: 'start', key: 'lot_no' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '接種日', align: 'start', key: 'date_vaccinated' },
  { title: '症状発生日', align: 'start', key: 'date_occurred' },
  { title: '症状名', align: 'start', key: 'PT_name' },
  { title: '重症度', align: 'start', key: 'severity' },
  { title: '転帰日', align: 'start', key: 'result_date' },
  { title: '転帰内容', align: 'start', key: 'result' },
  { title: '元資料', align: 'start', key: 'source' }
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
