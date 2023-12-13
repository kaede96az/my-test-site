<template>
	<div v-if="sArray.length > 1">
		<span v-if="sArray[0].length >= 10">{{ sArray[0].substring(0, 7) + '...' }}</span>
		<span v-else>{{ sArray[0] + '...' }}</span>
    </div>
	<div v-else>-</div>
</template>

<script setup lang="ts">
defineProps<{
  sArray: string[]
}>()
</script>