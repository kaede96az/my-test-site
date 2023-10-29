<template>

  <v-container>

    <h2>本サイトについて</h2>
    <p>厚生労働省のサイトには、新型コロナワクチンの「副反応疑い報告」や「予防接種健康被害」に関する情報が
      PDF形式で多数掲載されています。それらのデータを見やすく整理して検索可能にし、より多くの人にとって
      見やすく、知見を得やすい情報源にするためのサイトです。</p>
    <br>

    <h2>コンテンツ</h2>

  <v-card color="light-blue-darken-1" variant="elevated">
    <v-card-title>副反応疑い報告・副作用報告</v-card-title>
    <v-card-text>新型コロナワクチンの接種により副反応や副作用を被った可能性がある方々に関して、
      医療機関や製薬会社が行なった報告がをまとめて、閲覧や検索をしやすくしています。
    </v-card-text>

    <v-item-group selected-class="bg-primary">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-hover v-slot:default="{isHovering, props}">
              <v-card
                v-bind="props"
                :prepend-icon="SuspectedIssuesHomeRoute.icon"
                :title="SuspectedIssuesHomeRoute.name"
                :href="`${baseURL}#${SuspectedIssuesHomeRoute.path}`"
                :elevation="isHovering ? 10:3"
              >
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <h4>製薬会社からの報告を検索するページ</h4>
        <v-row>
          <v-col cols="12" sm="6"
            v-for="(r, i) in SuspectedIssuesSubRoutes.slice(2,4)"
            :key="i"
          >
            <v-hover v-slot:default="{isHovering, props}">
              <v-card
                v-bind="props"
                :prepend-icon="r.icon"
                :title="r.name"
                :href="`${baseURL}#${r.path}`"
                :elevation="isHovering ? 10:3"
              >
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <h4>医療機関からの報告を検索するページ</h4>
        <v-row>
          <v-col cols="12" sm="6"
            v-for="(r, i) in SuspectedIssuesSubRoutes.slice(0,2)"
            :key="i"
          >
            <v-hover v-slot:default="{isHovering, props}">
              <v-card
                v-bind="props"
                :prepend-icon="r.icon"
                :title="r.name"
                :href="`${baseURL}#${r.path}`"
                :elevation="isHovering ? 10:3"
              >
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="expandSuspectedIssues = !expandSuspectedIssues" elevation="1" variant="outlined">
        {{ !expandSuspectedIssues ? '制度に関する情報はこちら' : '詳細情報を閉じる' }}
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="expandSuspectedIssues" color="light-blue-darken-1">
          <v-card-text>「 <a rel="nofollow" href="https://www.pmda.go.jp/safety/reports/hcp/prev-vacc-act/0003.html">予防接種法に関する報告の制度について</a> 」や
      「 <a rel="nofollow" href="https://www.cao.go.jp/consumer/history/01/kabusoshiki/tokuho/doc/110228_shiryou6.pdf">薬事法に基づく医薬品の副作用報告
        について（概要）</a> 」などをご覧ください。</v-card-text>
      </v-card>
    </v-expand-transition>

  </v-card>
  </v-container>

  <v-container>
  <v-card color="green-darken-1" variant="elevated">
    <v-card-title class="card-title">予防接種健康被害 救済制度</v-card-title>
    <v-card-text class="card-text">新型コロナワクチンなどの接種により副反応や副作用を被った可能性がある方々が、
      市町村を通じて申請することで医療費などの給付を受けられる仕組みがあります。認定済みの案件をまとめて、閲覧や
      検索をしやすくしています。
    </v-card-text>

    <v-item-group selected-class="bg-primary">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-hover v-slot:default="{isHovering, props}">
              <v-card
                v-bind="props"
                :prepend-icon="HealthHazardsHomeRoute.icon"
                :title="HealthHazardsHomeRoute.name"
                :href="`${baseURL}#${HealthHazardsHomeRoute.path}`"
                :elevation="isHovering ? 10:3"
              >
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <h4>認定済みの案件を検索するページ</h4>
        <v-row>
          <v-col cols="12" sm="6"
            v-for="(r, i) in HealthHazardsSubRoutes"
            :key="i"
          >
            <v-hover v-slot:default="{isHovering, props}">
              <v-card
                v-bind="props"
                :prepend-icon="r.icon"
                :title="r.name"
                :href="`${baseURL}#${r.path}`"
                :elevation="isHovering ? 10:3"
              >
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>

    </v-item-group>
    
    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="expandCertifiedIssues = !expandCertifiedIssues" elevation="1" variant="outlined">
        {{ !expandCertifiedIssues ? '制度に関する情報はこちら' : '詳細情報を閉じる' }}
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="expandCertifiedIssues" color="green-darken-1">
          <v-card-text>「 <a rel="nofollow" href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/vaccine_kenkouhigaikyuusai.html">予防接種健康被害救済制度</a> 」や
      「 <a rel="nofollow" href="https://www.pmda.go.jp/safety/reports/hcp/prev-vacc-act/0003.html">予防接種法に関する報告の制度について</a> 」、
      「 <a rel="nofollow" href="https://www.mhlw.go.jp/content/10900000/000912784.pdf">予防接種後健康被害救済制度について</a> 」などをご覧ください。</v-card-text>
      </v-card>
    </v-expand-transition>

  </v-card>
  </v-container>

</template>

<script setup lang="ts">
import { AppBarTitle, AppBarColor } from '@/router/data'
import {
HealthHazardsHomeRoute,
HealthHazardsSubRoutes,
SuspectedIssuesHomeRoute,
  SuspectedIssuesSubRoutes
} from '@/router/routes'
import { shallowRef } from 'vue';
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#E57373'

const baseURL = import.meta.env.BASE_URL
const expandSuspectedIssues = shallowRef(false)
const expandCertifiedIssues = shallowRef(false)
</script>

<style scoped>

</style>
