<script setup lang="ts">
import { AppBarTitle, AppBarColor} from '@/router/data'
AppBarTitle.value = 'Aboutページ'
AppBarColor.value = 'blue-grey-lighten-4'
</script>

<template>
  <v-sheet>
    <h2 class="text-h4">本サイトについて</h2>
    <p class="text-body-1">
      厚生労働省のサイトにてPDF形式で掲載されている「新型コロナワクチン副反応疑い報告」のデータを見やすく整理し、
      多くの人にとって見やすく、データから知見を得やすくするためのサイトです。
    </p>
    <br />
    <h2 class="text-h4">データについて</h2>
    <p class="text-body-1">
      「厚生科学審議会予防接種・ワクチン分科会副反応検討部会」のPDF資料から抽出したデータを使っています。
      できるだけ正確に情報を抽出するよう努めておりますが、当方はデータの正確さについて一切の責任を負いません。
    </p>
  </v-sheet>
</template>

<style scoped></style>
