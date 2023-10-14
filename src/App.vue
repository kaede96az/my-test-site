<script setup lang="ts">
import { RouterView } from 'vue-router'
import { routes } from './router/index'
</script>

<script lang="ts">
export default {
  data: () => ({
    drawer: false
  })
}
</script>

<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list v-for="r in routes" :key="r.name">
        <v-list-item
          :prepend-icon="r.icon"
          :title="r.name"
          :value="r.name"
          :href="r.path"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>副反応ダッシュボード</v-toolbar-title>
      </template>
    </v-app-bar>

    <!-- アプリケーションのコンポーネントに基づいてコンテンツのサイズを決定 -->
    <v-main>
      <!-- アプリケーションに適切なgutterを提供 -->
      <v-container fluid>
        <!-- vue-routerを使用する場合 -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<style scoped></style>
