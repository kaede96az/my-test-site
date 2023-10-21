<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  SuspectedIssuesHomeRoute,
  SuspectedIssuesSubRoutes,
  HealthProtectionHomeRoute,
  AboutRoute,
  HomeRoute
} from '@/router/routes'
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
        >
          <v-list-item-title class="root-title">{{ HomeRoute.name }}</v-list-item-title>
        </v-list-item>

        <v-list-group value="SuspectedIssues">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="SuspectedIssuesHomeRoute.icon"
              class="root-icon suspeted-issue-root"
            >
              <v-list-item-title class="root-title">{{
                SuspectedIssuesHomeRoute.name
              }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            prepend-icon="mdi-chart-bar"
            :href="`${baseURL}#${SuspectedIssuesHomeRoute.path}`"
            class="sub-icon suspeted-issue-sub"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">集計結果</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="(r, i) in SuspectedIssuesSubRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon suspeted-issue-sub"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{ r.name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group value="HealthProtection">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="HealthProtectionHomeRoute.icon"
              class="root-icon health-protection-root"
            >
              <v-list-item-title class="root-title health-protection-root">{{
                HealthProtectionHomeRoute.name
              }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            prepend-icon="mdi-chart-bar"
            :href="`${baseURL}#${HealthProtectionHomeRoute.path}`"
            class="sub-icon health-protection-sub"
          >
            <v-list-item-title class="sub-title health-protection-sub">集計結果</v-list-item-title>
          </v-list-item>
          <!--v-list-item
            v-for="r,i in HealthProtectionSubRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon"
          >
            <v-list-item-title class="sub-title">{{ r.name }}</v-list-item-title>
          </v-list-item-->
        </v-list-group>

        <v-list-item
          :prepend-icon="AboutRoute.icon"
          :value="AboutRoute.name"
          :href="`${baseURL}#${AboutRoute.path}`"
          class="root-icon"
        >
          <v-list-item-title class="root-title">{{ AboutRoute.name }}</v-list-item-title>
        </v-list-item>
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

.health-protection-root {
  color: #00c853;
}
.health-protection-sub {
  color: #558b2f;
}

.home {
  color: #c62828;
}
</style>
