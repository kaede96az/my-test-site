<template>
	<v-dialog transition="dialog-bottom-transition" width="auto">
		<template v-slot:activator="{ props }">
			<v-btn prepend-icon="mdi-help-circle-outline" v-bind="props">評価記号について...</v-btn>
		</template>

		<template v-slot:default="{ isActive }">
		<v-card title="因果関係の評価記号について">
			<v-card-text>
				α、β、γの評価記号は、それぞれ以下の意味で使用されているようです。
			</v-card-text>

			<v-card-text>
				<h3>α：「ワクチンと症状名との因果関係が否定できないもの」</h3>
				<p>原疾患との関係、薬理学的な観点や時間的な経過などの要素を勘案し、医学・薬学的観点から総合的に判断し、ワクチン接種が、事象発現の原因となったことが否定できない症例</p>
			</v-card-text>

			<v-card-text>
				<h3>β：「ワクチンと症状名との因果関係が認められないもの」</h3>
				<p>原疾患との関係、薬理学的な観点や時間的な経過などの要素を勘案し、医学・薬学的観点から総合的に判断し、ワクチン接種が、事象発現の原因となったとは認められない症例</p>
			</v-card-text>

			<v-card-text>
				<h3>γ：「情報不足等によりワクチンと症状名との因果関係が評価できないもの」</h3>
				<p>情報が十分でない、使用目的又は方法が適正でない等のためワクチン接種と事象発現との因果関係の評価ができない症例</p>
				<p class="text-caption text-right">※ <a href="https://www.mhlw.go.jp/content/10601000/001161441.pdf#page=29">元資料</a> からの引用です。</p>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					text="閉じる"
					@click="isActive.value = false"
				>閉じる</v-btn>
			</v-card-actions>
		</v-card>
		</template>
	</v-dialog>
</template>

<script setup lang="ts">
</script>

<style scoped>
.wrap-text {
	white-space: normal;
}
</style>
