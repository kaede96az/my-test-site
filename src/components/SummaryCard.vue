<script setup lang="ts">
defineProps<{
  icon: string
  tile_color: string
  title: string
  data: string
  unit: string
}>()
const variant = 'elevated'
</script>

<template>
  <v-card :variant="variant" :color="tile_color" :prepend-icon="icon" :title="title">
    <v-card-text align="right">
      <span class="card-text">{{ data }}</span> <span class="unit-text">({{ unit }})</span>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.card-text {
  font-size: 2.2rem;
}

.unit-text {
  font-size: 0.8rem;
}
</style>
