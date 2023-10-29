<script setup lang="ts">
import { AppBarTitle, AppBarColor } from '@/router/data'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-grey-lighten-4'
</script>

<template>
  <v-container>
    <v-sheet>
      <h2 class="text-h4">データについて</h2>
      <p class="text-body-1">
        「厚生科学審議会予防接種・ワクチン分科会副反応検討部会」のPDF資料から抽出したデータを使っています。
        できるだけ正確に情報を抽出するよう努めておりますが、当方はデータの正確さについて一切の責任を負いません。
      </p>
    </v-sheet>
  </v-container>
</template>

<style scoped></style>
