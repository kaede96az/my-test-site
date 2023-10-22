<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h4 class="text-h4">予防接種健康被害 救済制度</h4>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" v-for="item in items.certified_issues" :key="item.title">
        <SummaryCard
          :icon="SelectIcon(item.title)"
          :tile_color="SelectTileColor(item.title)"
          :title="item.title"
          :data="item.data"
          :unit="item.unit"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SummaryCard from '../components/SummaryCard.vue'
import type { ISummaryItems } from '../types/Summary'
import { SelectIcon } from '@/tools/SelectIcon'
import { SelectTileColor } from '@/tools/SelectTileColor'
import { AppBarTitle, AppBarColor } from '@/router/data'

AppBarTitle.value = '予防接種健康被害 救済制度 - 集計結果'
AppBarColor.value = '#00c853'

defineProps<{
  items: ISummaryItems
}>()
</script>

<style scoped></style>
