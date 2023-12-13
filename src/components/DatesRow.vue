<template>
	<div v-if="dates.length > 1">
		<span>{{ dates[0] + '...' }}</span>
    </div>
	<div v-else>-</div>
</template>

<script setup lang="ts">
defineProps<{
  dates: string[]
}>()
</script>