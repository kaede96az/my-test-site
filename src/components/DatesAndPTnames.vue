<template>
  <v-card variant="elevated" color="blue-grey-darken-1">
    <v-card-title>症状と経過の詳細（No. {{ no }}）</v-card-title>

    <v-card-text>
      <v-timeline density="compact" align="start">
        <v-timeline-item dot-color="yellow-darken-1" size="x-small">
          <div class="mb-4">
            <strong>{{ vaccinated_dates }}</strong>： ワクチンを接種
          </div>
        </v-timeline-item>

        <v-timeline-item dot-color="orange" size="x-small" v-for="([day, pts], i) in getMapWithDateAndPT(onset_dates, PT_names)" :key="day + '-' + i">
          <div class="mb-4">
            <strong>{{ day }}</strong>： <span v-if="ElapsedDays(vaccinated_dates[0], day) != undefined">[接種から <v-chip variant="elevated" label size="small" color="blue-grey-lighten-5">{{ ElapsedDays(vaccinated_dates[0], day) }}</v-chip> 日後]</span>
            <div class="pt-list">
              <ul v-for="pt, j in pts" :key="j">
                <li>{{ pt }}</li>
              </ul>
            </div>
          </div>
        </v-timeline-item>

        <v-timeline-item
          :dot-color="getTimeLineColor(gross_results[i])"
          size="x-small"
          v-for="([rDay, rs], i) in getMapWithResultDateAndResult(gross_result_dates, gross_results)"
          :key="rDay + '-' + i"
        >
          <div class="mb-4">
            <div>
              <strong>{{ rDay }}</strong>： <span v-if="ElapsedDays(vaccinated_dates[0], rDay) != undefined">[接種から <v-chip variant="elevated" label size="small" color="blue-grey-lighten-5">{{ ElapsedDays(vaccinated_dates[0], rDay) }}</v-chip> 日後]</span>
              <div class="pt-list">
                <ul v-for="r, j in rs" :key="j">
                  <li>{{ r }} ({{ PT_names[j] }})</li>
                </ul>
              </div>
            </div>
          </div>
        </v-timeline-item>

      </v-timeline>
    </v-card-text>

    <v-card-actions
      ><v-btn variant="outlined" @click="clickClose"
        >詳細表示を閉じる</v-btn
      ></v-card-actions
    >
  </v-card>
</template>

<script setup lang="ts">
import { ElapsedDays } from '@/tools/ElapsedDays';

defineProps<{
  no: number
  vaccinated_dates: string[]
  onset_dates: string[]
  PT_names: string[]
  gross_result_dates: string[]
  gross_results: string[]
  clickClose: () => void
}>()

const getMapWithDateAndPT = (dates: string[], PTs: string[]): Map<string, string[]> => {
  let ptMap = new Map<string, string[]>();
  let index = 0
  for (index; index < dates.length; index++) {
    var val = ""
    if(PTs.length <= index){
      val = ""
    } else {
      val = PTs[index]
    }

    if(val == "" || val == ' '){
      continue
    }

    if( !ptMap.has(dates[index]) ){
      ptMap.set(dates[index], [val])
    } else {
      ptMap.get(dates[index])?.push(val)
    }
  }

  if(PTs.length > dates.length){
    for (let pIndex = index; pIndex < PTs.length; pIndex++) {
      const ptVal = PTs[pIndex]
      if(ptVal != ""){
        ptMap.get(dates[index-1])?.push(ptVal)
      }
    }
  }

  return new Map([...ptMap.entries()].sort())
}

const getMapWithResultDateAndResult = (resultDates: string[], results: string[]): Map<string, string[]> => {
  let ptMap = new Map<string, string[]>();
  let index = 0
  for (index; index < resultDates.length; index++) {
    var val = ""
    if(results.length <= index){
      val = ""
    } else {
      val = results[index]
    }

    if(val == "" || val == ' '){
      continue
    }

    if( !ptMap.has(resultDates[index]) ){
      ptMap.set(resultDates[index], [val])
    } else {
      ptMap.get(resultDates[index])?.push(val)
    }
  }

  if(results.length > resultDates.length){
    for (let pIndex = index; pIndex < results.length; pIndex++) {
      const ptVal = results[pIndex]
      if(ptVal != ""){
        ptMap.get(resultDates[index-1])?.push(ptVal)
      }
    }
  }

  return new Map([...ptMap.entries()].sort())
}

const getTimeLineColor = (r: string): string => {
  if(r.indexOf('死亡') > -1) return 'red'
  if(r.indexOf('後遺症あり') > -1) return 'pink-darken-4'
  if(r.indexOf('未回復') > -1) return 'orange'
  if(r.indexOf('軽快') > -1) return 'lime'
  if(r.indexOf('回復') > -1) return 'green'

  return 'grey'
}
</script>

<style scoped>
.pt-list {
  padding-left: 20px;
  padding-top: 5px;
}
</style>
