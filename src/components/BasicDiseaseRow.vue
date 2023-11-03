<template>
	<div v-if="SplitBasicDisease(bd).length > 1">
		<div v-if="SplitBasicDisease(bd)[0].length >= 10">
			<span v-if="isExpanded(item)">{{ SplitBasicDisease(bd)[0] }}</span>
			<span v-else>{{ SplitBasicDisease(bd)[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span v-if="isExpanded(item)">{{ SplitBasicDisease(bd)[0] }}</span>
			<span v-else>{{ SplitBasicDisease(bd)[0] + '...' }}</span>
		</div>
    </div>
	<div v-else>
		<div v-if="bd.length >= 10">
			<span v-if="isExpanded(item)">{{ bd }}</span>
			<span v-else>{{ bd.substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ bd }}</div>
	</div>
</template>

<script setup lang="ts">
import {SplitBasicDisease} from '@/tools/SplitData'

defineProps<{
  item: any
  bd: string
  isExpanded: (item: any) => boolean
}>()
</script>