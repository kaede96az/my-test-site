<script setup lang="ts">
import SummaryCard from '../components/SummaryCard.vue'
import type { ISummaryItems } from '../types/Summary'

defineProps<{
  items: ISummaryItems
}>()

const selectIcon = (title: string): string => {
  switch (title) {
    case '副反応疑い':
    case '副反応':
      return 'mdi-message-alert'
    case '重篤':
      return 'mdi-account-alert'
    case '死亡':
      return 'mdi-heart-off'

    default:
      return 'mdi-info'
  }
}

const selectTileColor = (title: string): string => {
  switch (title) {
    case '副反応疑い':
      return 'yellow-lighten-3'
    case '副反応':
      return 'orange-darken-1'
    case '重篤':
      return 'deep-orange-darken-1'
    case '死亡':
      return '#c83f3d'

    default:
      return 'orange-accent-1'
  }
}
</script>

<template>
  <v-container>
    <h4 class="text-h4">報告数</h4>
    <v-row>
      <v-col cols="12" sm="4" v-for="item in items.reported_issues" :key="item.title">
        <SummaryCard
          :icon="selectIcon(item.title)"
          :tile_color="selectTileColor(item.title)"
          :title="item.title"
          :data="item.data"
          :unit="item.unit"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <apexchart
          height="400"
          type="bar"
          :options="{
            chart: { id: 'number_of_deaths_reported_by_age_group' },
            colors: ['#c83f3d'],
            title: { text: '年代別死亡報告数', floating: true },
            xaxis: {
              title: { text: '年代' },
              categories: items.number_of_deaths_reported_by_age_group.x_axis.data
            },
            yaxis: { title: { text: '死亡報告数 (人)' } },
            plotOptions: { bar: { horizontal: true, borderRadius: 2 } }
          }"
          :series="[
            {
              name: items.number_of_deaths_reported_by_age_group.y_axis.name,
              data: items.number_of_deaths_reported_by_age_group.y_axis.data
            }
          ]"
        ></apexchart>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <h4 class="text-h4">因果関係を認定済み</h4>
    <v-row>
      <v-col cols="12" sm="6" v-for="item in items.certified_issues" :key="item.title">
        <SummaryCard
          :icon="selectIcon(item.title)"
          :tile_color="selectTileColor(item.title)"
          :title="item.title"
          :data="item.data"
          :unit="item.unit"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
