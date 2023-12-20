<template>
	<span v-if="content.length >= 10">{{ content.substring(0, 7) + '...' }}</span>
	<span v-else>{{ content[0] }}</span>
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>