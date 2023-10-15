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
  <h4 class="text-h4">報告数</h4>
  <v-container v-for="item in items.reported_items" :key="item.title">
    <SummaryCard
      :icon="selectIcon(item.title)"
      :tile_color="selectTileColor(item.title)"
      :title="item.title"
      :data="item.data"
      :unit="item.unit"
    />
  </v-container>

  <h4 class="text-h4">因果関係を認定済み</h4>
  <v-container v-for="item in items.certified_items" :key="item.title">
    <SummaryCard
      :icon="selectIcon(item.title)"
      :tile_color="selectTileColor(item.title)"
      :title="item.title"
      :data="item.data"
      :unit="item.unit"
    />
  </v-container>
</template>

<style scoped></style>
