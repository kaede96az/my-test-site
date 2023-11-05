<template>
	<v-toolbar density="compact">
		<v-snackbar :timeout="2000" color="blue-grey-darken-3">
		<template v-slot:activator="{ props }">
			<v-btn prepend-icon="mdi-content-copy" color="green-darken-1" variant="outlined" @click="copyFunc" v-bind="props">URLコピー</v-btn>
		</template>
		クリップボードに検索結果のURLをコピーしました!
		</v-snackbar>
		<v-divider class="ms-3" inset vertical></v-divider>
		<v-snackbar :timeout="2000" color="blue-grey-darken-3">
		<template v-slot:activator="{ props }">
			<v-btn prepend-icon="mdi-download" color="green-darken-1" variant="outlined" @click="downloadFunc" v-bind="props">CSVダウンロード</v-btn>
		</template>
		検索結果をCSVファイルでダウンロード開始します!
		</v-snackbar>
	</v-toolbar>
</template>

<script setup lang="ts">
defineProps<{
  copyFunc: () => void
  downloadFunc: () => void
}>()
</script>