<template>
	<div v-if="certifiedRelation(CR)">
		<div v-if="!inverse">
			<v-chip color="pink" label>
				<v-icon start icon="mdi-alert-outline"></v-icon>
				<span>{{ CR }}</span>
			</v-chip>
		</div>
		<div v-else>
			<v-chip color="pink-accent-1" label>
				<v-icon start icon="mdi-alert-outline"></v-icon>
				<span class="inverse-text">{{ CR }}</span>
			</v-chip>
		</div>
	</div>
	<div v-else>
		<span>{{ CR }}</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{
  CR: string
  inverse: boolean
}>()

const certifiedRelation = (cr: string): boolean => {
	return cr.indexOf('関連あり') > -1
}
</script>

<style scoped>
.inverse-text {
	color: white;
}
</style>