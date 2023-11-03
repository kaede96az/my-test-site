<template>
  <div v-if="SplitDate(date).length > 1">
		<div v-if="SplitDate(date)[0].length > 10">
			<span>{{ SplitDate(date)[0].substring(0, 10) + '...' }}</span>
		</div>
		<div v-else>
			<span>{{ SplitDate(date)[0] + '...' }}</span>
		</div>
    </div>
	<div v-else>
		<div v-if="date.length > 10">
			<span>{{ date.substring(0, 10) + '...' }}</span>
		</div>
		<div v-else>
			<span>{{ date }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import {SplitDate} from '@/tools/SplitData'

defineProps<{
  date: string
}>()
</script>