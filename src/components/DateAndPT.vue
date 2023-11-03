<template>
  <v-card variant="elevated" color="blue-grey-darken-1">
    <v-card-title>症状と経過の詳細（No. {{ no }}）</v-card-title>

    <v-card-text>
      <v-timeline density="compact" align="start">
        <v-timeline-item dot-color="yellow-darken-1" size="x-small">
          <div class="mb-4">
            <div>
              <strong>{{ date_vaccinated }}</strong>： ワクチンを接種
            </div>
          </div>
        </v-timeline-item>

        <v-timeline-item dot-color="orange" size="x-small" v-for="([day, pts], i) in getMapWithDateAndPT(SplitDate(date_occurred), SplitDate(PT))" :key="day + '-' + i">
          <div class="mb-4">
            <div>
              <strong>{{ day }}</strong>：
              <div class="pt-list">
                <ul v-for="pt, j in pts" :key="j">
                  <li>{{ pt }}{{ postfix }}</li>
                </ul>
              </div>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <v-card-item v-if="CR != ''">
      <strong>因果関係（時系列順）：</strong>
      <div class="pt-list">
        <ol>
          <li v-for="crItem, i in SplitWithArrow(CR)" :key="i">
            <CrChip :CR="crItem" inverse></CrChip>
          </li>
        </ol>
      </div>
    </v-card-item>

    <v-card-actions
      ><v-btn variant="outlined" @click="clickClose"
        >詳細表示を閉じる</v-btn
      ></v-card-actions
    >
  </v-card>
</template>

<script setup lang="ts">
import {SplitDate, SplitWithArrow} from '@/tools/SplitData'
import CrChip from '@/components/CertifiedRelationChip.vue'

defineProps<{
  no: string
  date_vaccinated: string
  date_occurred: string
  PT: string
  postfix: string
  CR: string
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
</script>

<style scoped>
.pt-list {
  padding-left: 20px;
  padding-top: 5px;
}
</style>
