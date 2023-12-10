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
      <h4 class="text-h4">判定結果</h4>
      <p class="text-body-1">進達受理件数の総数 <b>{{ items.total_entries.toLocaleString() }}</b> [件] に対して、判定結果の割合は以下の通りです。</p>

      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" v-if="isPersentView">件数表示に切り替え</v-btn>
        <v-btn size="small" @click="changeChartView" v-else>割合表示に切り替え</v-btn>
      </div>

      <v-row>
        
        <v-col cols="12" sm="6">
          <apexchart :options="judgementChartOptions" :series="judgementChartSeries" ></apexchart>
        </v-col>

        <v-col cols="12" sm="6">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">判定結果</th>
                <th class="text-left">件数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in judgementTableSeries" :key="item.name">
                <td v-if="item.name == '合計'"><b>{{ item.name }}</b></td>
                <td v-else><v-chip variant="flat" :color="selectItemColor(item.name)">{{ item.name }}</v-chip></td>

                <td class="text-right" v-if="item.name == '合計'"><b>{{ item.data.toLocaleString() }}</b></td>
                <td class="text-right" v-else>{{ item.data.toLocaleString() }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

      </v-row>
      
    </v-container>

    <v-container>
      <h4 class="text-h4">申請内容</h4>
      <p class="text-body-1">認定・否認された申請の総数 <b>{{ certified_and_denied_count.toLocaleString() }}</b> [件] に対して、申請内容の内訳はそれぞれ以下の通りです。</p>

      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" v-if="isPersentView">件数表示に切り替え</v-btn>
        <v-btn size="small" @click="changeChartView" v-else>割合表示に切り替え</v-btn>
      </div>
      
      <v-row>

        <v-col cols="12" sm="6">
          <apexchart :options="certifiedClaimChartOptions" :series="certifiedClaimChartSeries"></apexchart>
        </v-col>

        <v-col cols="12" sm="6">
          <apexchart :options="deniedClaimChartOptions" :series="deniedClaimChartSeries"></apexchart>
        </v-col>

      </v-row>
    </v-container>

    <p class="text-caption text-right">※ <b>{{ items?.date }}</b> 時点の「疾病・障害認定審査会」累計データを用いて算出しています。</p>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, CertifiedSummaryURL } from '@/router/data'
import router from '@/router/index'
import type { ICertifiedSummary } from '@/types/CertifiedSummary'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'green'

const isPersentView = shallowRef(true)

const items = shallowRef<ICertifiedSummary>()
const certified_and_denied_count = shallowRef<number>(0)
onMounted(() => {
  axios.get<ICertifiedSummary>(CertifiedSummaryURL)
    .then((response) => {
      items.value = response.data

      if(items.value?.certified_count == undefined ||
        items.value?.denied_count == undefined ||
        items.value?.pending_count == undefined ||
        items.value?.open_cases_count == undefined ||
        items.value?.total_entries == undefined ||
        items.value.certified_death_count == undefined ||
        items.value.denied_death_count == undefined
      ) {
        console.log('failed to get certified summary data because some of them are undefined.')
        return
      }
      
      judgementChartSeries.value.push(items.value.certified_count)
      judgementChartSeries.value.push(items.value.denied_count)
      judgementChartSeries.value.push(items.value.pending_count)
      judgementChartSeries.value.push(items.value.open_cases_count)

      judgementTableSeries.value.push({name: '認定', data: items.value.certified_count})
      judgementTableSeries.value.push({name: '否認', data: items.value.denied_count})
      judgementTableSeries.value.push({name: '保留', data: items.value.pending_count})
      judgementTableSeries.value.push({name: '未処理', data: items.value.open_cases_count})
      judgementTableSeries.value.push({name: '合計', data: items.value.total_entries})

      certified_and_denied_count.value = items.value.certified_count + items.value.denied_count

      certifiedClaimChartSeries.value.push(items.value.certified_count - items.value.certified_death_count)
      certifiedClaimChartSeries.value.push(items.value.certified_death_count)

      deniedClaimChartSeries.value.push(items.value.denied_count - items.value.denied_death_count)
      deniedClaimChartSeries.value.push(items.value.denied_death_count)

      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get certified summary data: ' + error))
})

const judgementTableSeries = shallowRef<any[]>([])
const itemColors = ['#5FAF51', '#F23B61', '#F6AD21', '#808080']
const selectItemColor = (name: any): string => {
  switch (name) {
    case '認定':
      return itemColors[0]
    case '否認':
      return itemColors[1]
    case '保留':
      return itemColors[2]
  
    default:
      return itemColors[3]
  }
}

const judgementChartSeries = shallowRef<number[]>([])
const judgementChartOptions = {
  chart: { type: 'pie' },
  labels: ['認定', '否認', '保留', '未処理'],
  legend: {
    position: 'bottom',
  },
  colors: itemColors,
  tooltip: {
    y: {
        formatter: (val: any) => {
          return (val as number).toLocaleString() + ' 件'
        },
    },
  },
  responsive: [{
    breakpoint: 800,
    options: {
      chart: {
        width: 300
      }
    }
  }],
  dataLabels: {
    formatter: function (val: any, { seriesIndex, dataPointIndex, w } :any ) {
      if(isPersentView.value){
        return val.toFixed(1) + ' %'
      } else {
        return w.config.series[seriesIndex].toLocaleString() + ' 件'
      }
    },
    style: {
      fontSize: '1.2rem',
    },
  },
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0
      }
    }
  }
}

const certifiedClaimChartSeries = shallowRef<any[]>([])
const certifiedClaimChartOptions = {
  title: {
    text: '認定された案件の内訳',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: ['医療費・医療手当 又は 障害年金', '死亡一時金 又は 葬祭料'],
  colors: ['#64B5F6', '#F48FB1'],
  tooltip: {
    y: {
        formatter: (val: any) => {
          return (val as number).toLocaleString() + ' 件'
        },
    },
  },
  responsive: [{
    breakpoint: 800,
    options: {
      chart: {
        width: 300
      }
    }
  }],
  dataLabels: {
    formatter: function (val: any, { seriesIndex, dataPointIndex, w } :any ) {
      if(isPersentView.value){
        return val.toFixed(1) + ' %'
      } else {
        return w.config.series[seriesIndex].toLocaleString() + ' 件'
      }
    },
    style: {
      fontSize: '1.2rem',
    }
  }
}

const deniedClaimChartSeries = shallowRef<any[]>([])
const deniedClaimChartOptions = {
  title: {
    text: '否認された案件の内訳',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: ['医療費・医療手当 又は 障害年金', '死亡一時金 又は 葬祭料'],
  colors: ['#64B5F6', '#F48FB1'],
  tooltip: {
    y: {
        formatter: (val: any) => {
          return (val as number).toLocaleString() + ' 件'
        },
    },
  },
  responsive: [{
    breakpoint: 800,
    options: {
      chart: {
        width: 300
      }
    }
  }],
  dataLabels: {
    formatter: function (val: any, { seriesIndex, dataPointIndex, w } :any ) {
      if(isPersentView.value){
        return val.toFixed(1) + ' %'
      } else {
        return w.config.series[seriesIndex].toLocaleString() + ' 件'
      }
    },
    style: {
      fontSize: '1.2rem',
    }
  }
}

const changeChartView = () => {
  isPersentView.value = !isPersentView.value
  window.dispatchEvent(new Event('resize'))
}
</script>

<style scoped>

</style>
