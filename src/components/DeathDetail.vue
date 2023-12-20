<template>
  <v-card variant="elevated" color="blue-grey-darken-1">
    <v-card-title>接種からの経過（No. {{ no }}）</v-card-title>

    <v-card-text>
      <v-timeline density="compact" align="start">
        <v-timeline-item dot-color="yellow-darken-1" size="x-small">
          <div class="mb-4">
            <strong>{{ vaccinated_dates }}</strong>： ワクチンを接種
          </div>
        </v-timeline-item>

        <v-timeline-item dot-color="red" size="x-small">
          <div class="mb-4">
            <strong>{{ onset_dates[0] }}</strong>： <span v-if="ElapsedDays(vaccinated_dates, onset_dates[0]) != undefined">[接種から <v-chip variant="elevated" label size="small" color="blue-grey-lighten-5">{{ ElapsedDays(vaccinated_dates, onset_dates[0]) }}</v-chip> 日後]</span>
            <div class="pt-list">
              <ul v-for="pt, j in PT_names" :key="j">
                <li>{{ pt }}</li>
              </ul>
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
  vaccinated_dates: string
  onset_dates: string[]
  PT_names: string[]
  clickClose: () => void
}>()
</script>

<style scoped>
.pt-list {
  padding-left: 20px;
  padding-top: 5px;
}
</style>
