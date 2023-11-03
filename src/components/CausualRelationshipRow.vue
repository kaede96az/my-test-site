<template>
	<div v-if="SplitWithArrow(CR).length > 1">
		<div v-if="SplitWithArrow(CR)[0].length >= 10">
			<span v-if="isExpanded(item)">{{ SplitWithArrow(CR)[0] }}</span>
			<span v-else>{{ SplitWithArrow(CR)[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span v-if="isExpanded(item)">{{ SplitWithArrow(CR)[0] }}</span>
			<span v-else>{{ SplitWithArrow(CR)[0] + '...' }}</span>
		</div>
    </div>
	<div v-else>
		<div v-if="CR.length >= 10">
			<span v-if="isExpanded(item)">{{ CR }}</span>
			<span v-else>{{ CR.substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ CR }}</div>
	</div>
</template>

<script setup lang="ts">
import {SplitWithArrow} from '@/tools/SplitData'

defineProps<{
  item: any
  CR: string
  isExpanded: (item: any) => boolean
}>()
</script>