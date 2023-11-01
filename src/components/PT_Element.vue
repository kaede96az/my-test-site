<template>
	<div v-if="SplitValue(item.raw[name]).length > 1">
		<div v-if="SplitValue(item.raw[name])[0].length >= 10">
			<span v-if="isExpanded(item)">{{ SplitValue(item.raw[name])[0] }}</span>
			<span v-else>{{ SplitValue(item.raw[name])[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ SplitValue(item.raw[name])[0] + '...' }}</div>
    </div>
	<div v-else>
		<div v-if="item.raw[name].length >= 10">
			<span v-if="isExpanded(item)">{{ item.raw[name] }}</span>
			<span v-else>{{ item.raw[name].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ item.raw[name] + '...' }}</div>
	</div>
</template>

<script setup lang="ts">
import {SplitValue} from '@/tools/SplitData'

defineProps<{
  item: any
  name: string
  isExpanded: (item: any) => boolean
}>()
</script>