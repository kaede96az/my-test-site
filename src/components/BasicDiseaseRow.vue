<template>
	<div v-if="pre_existing_conditions.length > 1">
		<div v-if="pre_existing_conditions[0].length >= 10">
			<span>{{ pre_existing_conditions[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span>{{ pre_existing_conditions[0] + '...' }}</span>
		</div>
    </div>

	<div v-else-if="pre_existing_conditions.length == 1">
		<div v-if="pre_existing_conditions[0].length >= 10">
			<span>{{ pre_existing_conditions[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ pre_existing_conditions[0] }}</div>
	</div>
	
	<div v-else></div>
</template>

<script setup lang="ts">
import {SplitBasicDisease} from '@/tools/SplitData'

defineProps<{
  pre_existing_conditions: string[]
}>()
</script>