<template>
  <v-card variant="elevated" color="blue-grey-darken-1" class="base">
    <v-card-title>症状一覧</v-card-title>

    <v-card-text class="test">
      <div class="mb-4">
        <div class="bd-list">
          <ul v-for="bd, j in symptoms.filter( n => n != '' ).filter( m => m != ' ' )" :key="j">
            <li>{{ bd }}</li>
          </ul>
        </div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn variant="outlined" @click="clickClose">詳細表示を閉じる</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  symptoms: string[]
  clickClose: () => void
}>()
</script>

<style scoped>
.base {
  height: 100%;
}

.bd-list {
  padding-left: 20px;
  padding-top: 5px;
}

.test {
  width: 100%;
}
</style>
