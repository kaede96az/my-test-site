<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h4 class="text-h4">予防接種健康被害 救済制度</h4>
      </v-col>
    </v-row>

    <v-container v-if="items == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>
    <v-container v-else>
    <v-row>
      <v-col cols="12" sm="6" v-for="item in items.certified_issues.summary_items" :key="item.title">
        <SummaryCard
          :icon="SelectIcon(item.title)"
          :tile_color="SelectTileColor(item.title)"
          :title="item.title"
          :data="item.data"
          :unit="item.unit"
        />
      </v-col>
      <v-container>
        <p>※ 上記は 「 <a :href="items.certified_issues.source_info.url">{{ items.certified_issues.source_info.date }}: {{ items.certified_issues.source_info.description }}</a> 」までのデータを用いて算出しています。</p>
      </v-container>
    </v-row>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import SummaryCard from '../components/SummaryCard.vue'
import type { ISummaryItems } from '../types/Summary'
import { SelectIcon } from '@/tools/SelectIcon'
import { SelectTileColor } from '@/tools/SelectTileColor'
import { AppBarTitle, AppBarColor } from '@/router/data'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#00c853'

const items = shallowRef<ISummaryItems>()
const data_url = 'https://gist.githubusercontent.com/kaede96az/b9102295771f6c4bf0f3e98ea2d2e6f2/raw/9fc00ccd479da2bd860b82e867b1fea4e41d3db7/summary.json' 
onMounted( () => {
  axios.get<ISummaryItems>(data_url)
  .then(response => items.value = response.data)
  .catch(error => console.log('failed to get summary data: ' + error))
})
</script>

<style scoped></style>
