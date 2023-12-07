<template>
	<div v-if="certifiedRelation(description_of_claim)">
		<v-chip color="pink" label>
			<v-icon start icon="mdi-alert-outline"></v-icon>
			<span>{{ description_of_claim }}</span>
		</v-chip>
	</div>
	
	<div v-else>
		<span>{{ description_of_claim }}</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{
  description_of_claim: string
}>()

const certifiedRelation = (dc: string): boolean => {
	return dc.indexOf('死亡一時金') > -1 || dc.indexOf('葬祭料') > -1
}
</script>

<style scoped></style>