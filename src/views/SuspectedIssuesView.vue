<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h4 class="text-h4">副反応疑い報告</h4>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="4" v-for="item in items.reported_issues" :key="item.title">
        <SummaryCard
          :icon="SelectIcon(item.title)"
          :tile_color="SelectTileColor(item.title)"
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
            title: { text: '年代別の死亡報告数', floating: true },
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
      <v-col cols="12" sm="6">
        <apexchart
          height="400"
          type="bar"
          :options="{
            chart: { id: 'number_of_deaths_reported_by_vaccinated_times_group' },
            colors: ['#c83f3d'],
            title: { text: '接種回数別の死亡報告数', floating: true },
            xaxis: {
              title: { text: '接種回数' },
              categories: items.number_of_deaths_reported_by_vaccinated_times_group.x_axis.data
            },
            yaxis: { title: { text: '死亡報告数 (人)' } },
            plotOptions: { bar: { horizontal: true, borderRadius: 2 } }
          }"
          :series="[
            {
              name: items.number_of_deaths_reported_by_vaccinated_times_group.y_axis.name,
              data: items.number_of_deaths_reported_by_vaccinated_times_group.y_axis.data
            }
          ]"
        ></apexchart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SummaryCard from '../components/SummaryCard.vue'
import type { ISummaryItems } from '@/types/Summary'
import { SelectIcon } from '@/tools/SelectIcon'
import { SelectTileColor } from '@/tools/SelectTileColor'
import { AppBarTitle, AppBarColor } from '@/router/data'

AppBarTitle.value = '副反応疑い報告 - 集計結果'
AppBarColor.value = '#2962ff'

defineProps<{
  items: ISummaryItems
}>()
</script>

<style scoped></style>
