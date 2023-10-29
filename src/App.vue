<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  SuspectedIssuesHomeRoute,
  SuspectedIssuesSubRoutes,
  HealthHazardsHomeRoute,
  AboutRoute,
  HomeRoute,
  HealthHazardsSubRoutes
} from '@/router/routes'
import { AppBarTitle, AppBarColor } from '@/router/data'
import { shallowRef } from 'vue'

const selectedItem = shallowRef('')

const baseURL = import.meta.env.BASE_URL
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
    <v-app-bar app :color="AppBarColor">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ AppBarTitle }}</v-toolbar-title>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary width="10rem">
      <v-list>
        <v-list-item>
          <v-list-item-title class="title">
            <span class="font-weight-bold">副反応ダッシュボード</span>
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item
          :prepend-icon="HomeRoute.icon"
          :value="HomeRoute.name"
          :href="`${baseURL}#${HomeRoute.path}`"
          class="root-icon home"
          :active="HomeRoute.name === selectedItem"
          @click="selectedItem = HomeRoute.name"
        >
          <v-list-item-title class="root-title">{{ HomeRoute.menu_name }}</v-list-item-title>
        </v-list-item>

        <v-list-group value="SuspectedIssues">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-file-document-alert-outline"
              class="root-icon suspeted-issue-root"
            >
              <v-list-item-title class="root-title">副反応疑い報告</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            :prepend-icon="SuspectedIssuesHomeRoute.icon"
            :href="`${baseURL}#${SuspectedIssuesHomeRoute.path}`"
            class="sub-icon suspeted-issue-sub"
            :active="SuspectedIssuesHomeRoute.name === selectedItem"
            @click="selectedItem = SuspectedIssuesHomeRoute.name"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{ SuspectedIssuesHomeRoute.menu_name }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="(r, i) in SuspectedIssuesSubRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon suspeted-issue-sub"
            :active="r.name === selectedItem"
            @click="selectedItem = r.name"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{ r.menu_name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group value="HealthProtection">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-medical-bag"
              class="root-icon health-hazards-root"
            >
              <v-list-item-title class="root-title health-hazards-root">予防接種健康被害 救済制度</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            :prepend-icon="HealthHazardsHomeRoute.icon"
            :href="`${baseURL}#${HealthHazardsHomeRoute.path}`"
            class="sub-icon health-hazards-sub"
            :active="HealthHazardsHomeRoute.name === selectedItem"
            @click="selectedItem = HealthHazardsHomeRoute.name"
          >
            <v-list-item-title class="sub-title health-hazards-sub">{{ HealthHazardsHomeRoute.menu_name }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="(r, i) in HealthHazardsSubRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon health-hazards-sub"
            :active="r.name === selectedItem"
            @click="selectedItem = r.name"
          >
            <v-list-item-title class="sub-title health-hazards-sub">{{ r.menu_name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          :prepend-icon="AboutRoute.icon"
          :value="AboutRoute.name"
          :href="`${baseURL}#${AboutRoute.path}`"
          class="root-icon"
          :active="AboutRoute.name === selectedItem"
          @click="selectedItem = AboutRoute.name"
        >
          <v-list-item-title class="root-title">{{ AboutRoute.menu_name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

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

<style scoped>
.root-icon {
  font-size: 2rem;
}

.root-title {
  font-size: 1.5rem;
}

.sub-icon {
  font-size: 1.5rem;
}

.sub-title {
  font-size: 1.2rem;
}

.suspeted-issue-root {
  color: #2962ff;
}
.suspeted-issue-sub {
  color: #00b0ff;
}

.health-hazards-root {
  color: #00c853;
}
.health-hazards-sub {
  color: #558b2f;
}

.home {
  color: #c62828;
}

.app-title {
  color: #fafafa;
}
</style>
