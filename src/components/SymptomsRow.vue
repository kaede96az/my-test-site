<template>
	<div v-if="symptoms.length > 1">
		<div v-if="symptoms[0].length >= 10">
			<span>{{ symptoms[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>
			<span>{{ symptoms[0] + '...' }}</span>
		</div>
    </div>
	<div v-else-if="symptoms.length == 1">
		<div v-if="symptoms[0].length >= 10">
			<span>{{ symptoms[0].substring(0, 7) + '...' }}</span>
		</div>
		<div v-else>{{ symptoms[0] }}</div>
	</div>
	<div v-else></div>
</template>

<script setup lang="ts">
defineProps<{
  symptoms: string[]
}>()
</script>