<template>
	<v-toolbar density="compact" border>
		
		<v-snackbar :timeout="2000" color="blue-grey-darken-3">
		<template v-slot:activator="{ props }">
			<v-btn class="d-none d-sm-flex" prepend-icon="mdi-content-copy" :color="btnColor" variant="outlined" @click="copyFunc" v-bind="props">URLコピー</v-btn>
			<v-btn class="d-flex d-sm-none" prepend-icon="mdi-content-copy" :color="btnColor" variant="outlined" @click="copyFunc" v-bind="props">URL</v-btn>
		</template>
		クリップボードに検索結果のURLをコピーしました!
		</v-snackbar>

		<v-divider class="ms-1" inset vertical></v-divider>

		<v-snackbar :timeout="2000" color="blue-grey-darken-3">
		<template v-slot:activator="{ props }">
			<v-btn class="d-none d-sm-flex" prepend-icon="mdi-download" :color="btnColor" variant="outlined" @click="downloadFunc" v-bind="props">CSVダウンロード</v-btn>
			<v-btn class="d-flex d-sm-none" prepend-icon="mdi-download" :color="btnColor" variant="outlined" @click="downloadFunc" v-bind="props">CSV</v-btn>
		</template>
		検索結果をCSVファイルでダウンロード開始します!
		</v-snackbar>

		<v-divider class="ms-1" inset vertical></v-divider>

		<v-dialog transition="dialog-bottom-transition" width="auto">
			<template v-slot:activator="{ props }">
				<v-btn class="d-none d-sm-flex" prepend-icon="mdi-backspace-outline" :color="btnColor" variant="outlined" v-bind="props">検索条件クリア</v-btn>
				<v-btn class="d-flex d-sm-none" prepend-icon="mdi-backspace-outline" :color="btnColor" variant="outlined" v-bind="props">検索条件</v-btn>
			</template>

			<template v-slot:default="{ isActive }">
			<v-card>
				<v-toolbar
				color="orange-darken-1"
				title="検索条件をクリアする"
				></v-toolbar>
				<v-card-text>
					<span>入力済みの検索条件を全て削除します。良いですか？</span>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn variant="flat" color="orange-darken-1" @click="() => {isActive.value = false; clearFunc()}">はい</v-btn>
					<v-btn variant="outlined" @click="isActive.value = false">いいえ</v-btn>
				</v-card-actions>
			</v-card>
			</template>
		</v-dialog>
	</v-toolbar>
</template>

<script setup lang="ts">
defineProps<{
  copyFunc: () => void
  downloadFunc: () => void
  clearFunc: () => void
  btnColor: string
}>()
</script>