<template>
	<span v-if="SplitDate(item.raw.date_occurred).length > 1 && !isExpanded(item)">{{
        SplitDate(item.raw.date_occurred)[0] + '...'
      }}</span>
      <span v-else-if="SplitDate(item.raw.date_occurred).length > 1 && isExpanded(item)">{{
        SplitDate(item.raw.date_occurred)[0]
      }}</span>
    <span v-else>{{ item.raw.date_occurred }}</span>
</template>

<script setup lang="ts">
import {SplitDate} from '@/tools/SplitData'

defineProps<{
  item: any
  isExpanded: (item: any) => boolean
}>()
</script>