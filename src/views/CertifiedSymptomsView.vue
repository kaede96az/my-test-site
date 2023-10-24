<template>
  <v-container fluid>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title color="#66BB6A">
          <v-icon class="search-icon">mdi-magnify</v-icon>
          <span class="search-title">詳細検索...</span>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-row>
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
                label="合計件数（最小値）"
                v-model="sumFromFilterVal"
                @input="triggerFunc()"
                type="number"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" class="group">
              <v-text-field
                label="合計件数（最大値）"
                v-model="sumToFilterVal"
                @input="triggerFunc()"
                type="number"
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
        symptom_name: symptomsFilterFunc,
        sum_count: sumFilterFunc
      }"
    >
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { AppBarTitle, AppBarColor } from '@/router/data'
import { NumberFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import type { ICertifiedSymptoms } from '@/types/CertifiedSymptom'

AppBarTitle.value = '予防接種健康被害 救済制度 - 健康被害 認定済みの症状一覧'
AppBarColor.value = '#4CAF50'

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

const symptomsFilterVal = shallowRef('')
const symptomsFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, symptomsFilterVal)
}

const sumFromFilterVal = shallowRef('')
const sumToFilterVal = shallowRef('')
const sumFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value, sumFromFilterVal, sumToFilterVal)
}

defineProps<{
  items: ICertifiedSymptoms
}>()

let headers: any
headers = [
  { title: '症状', align: 'start', key: 'symptom_name' },
  { title: '件数 (男性)', align: 'end', key: 'male_count' },
  { title: '件数 (女性)', align: 'end', key: 'female_count' },
  { title: '合計件数', align: 'end', key: 'sum_count' }
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

.hosoku {
  margin-top: auto;
}
</style>
