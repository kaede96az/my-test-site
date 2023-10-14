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
    <v-card-text>
      <span class="text-h5">{{ data }}</span> <span class="card-unit">({{ unit }})</span>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.tile {
  position: relative;
  top: 60px;
  left: 10px;
  z-index: 10;
  width: 80px;
  height: 80px;
}
.card-icon {
  font-size: 2.8rem;
  position: relative;
  top: 1.1rem;
  left: 1.1rem;
}

.card-title-base {
  text-align: right;
}

.card-title-flex {
  display: flex;
}

.title {
  color: gray;
  font-size: 1rem;
  text-align: right;
  width: 100%;
  margin-top: 0.5rem;
}

.card-text-base {
  text-align: right;
}

.card-value {
  font-size: 1.8rem;
}
</style>
