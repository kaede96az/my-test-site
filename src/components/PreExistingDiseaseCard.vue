<template>
  <v-card variant="elevated" color="blue-grey-darken-1" class="base">
    <v-card-title>基礎疾患一覧</v-card-title>

    <v-card-text class="test">
      <div class="mb-4">
        <div class="bd-list">
          <ul v-for="bd, j in pre_existing_disease_names" :key="j">
            <li>{{ bd }}</li>
          </ul>
        </div>
      </div>
    </v-card-text>

  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  pre_existing_disease_names: string[]
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
