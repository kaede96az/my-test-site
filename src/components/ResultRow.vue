<template>
	<div v-if="SplitValue(result).length > 1">
		<div v-if="SplitValue(result)[0].length >= 10">
			<span>{{ SplitValue(result)[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span>{{ SplitValue(result)[0] + '...' }}</span>
		</div>
    </div>
	<div v-else>
		<div v-if="result.length >= 10">
			<span>{{ result.substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ result }}</div>
	</div>
</template>

<script setup lang="ts">
import {SplitValue} from '@/tools/SplitData'

defineProps<{
  result: string
}>()
</script>