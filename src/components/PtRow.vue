<template>
	<div v-if="SplitValue(PT).length > 1">
		<div v-if="SplitValue(PT)[0].length >= 10">
			<span v-if="isExpanded(item)">{{ SplitValue(PT)[0] }}</span>
			<span v-else>{{ SplitValue(PT)[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span v-if="isExpanded(item)">{{ SplitValue(PT)[0] }}</span>
			<span v-else>{{ SplitValue(PT)[0] + '...' }}</span>
		</div>
    </div>
	<div v-else>
		<div v-if="PT.length >= 10">
			<span v-if="isExpanded(item)">{{ PT }}</span>
			<span v-else>{{ PT.substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span>{{ PT }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import {SplitValue} from '@/tools/SplitData'

defineProps<{
  item: any
  PT: string
  isExpanded: (item: any) => boolean
}>()
</script>