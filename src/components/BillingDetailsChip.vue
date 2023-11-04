<template>
	<div v-if="certifiedRelation(billing_type)">
		<v-chip color="pink" label>
			<v-icon start icon="mdi-alert-outline"></v-icon>
			<span>{{ billing_type }}</span>
		</v-chip>
	</div>
	<div v-else>
		<span>{{ billing_type }}</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{
  billing_type: string
}>()

const certifiedRelation = (bt: string): boolean => {
	return bt.indexOf('死亡一時金') > -1 || bt.indexOf('葬祭料') > -1
}
</script>

<style scoped></style>