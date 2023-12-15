<template>
	<div v-if="SplitSymptoms(sym).length > 1">
		<div v-if="SplitSymptoms(sym)[0].length >= 10">
			<span>{{ SplitSymptoms(sym)[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span>{{ SplitSymptoms(sym)[0] + '...' }}</span>
		</div>
    </div>
	<div v-else>
		<div v-if="sym.length >= 10">
			<span>{{ sym.substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ sym }}</div>
	</div>
</template>

<script setup lang="ts">
import {SplitSymptoms} from '@/tools/SplitData'

defineProps<{
  sym: string
}>()
</script>