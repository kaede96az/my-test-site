<template>
  <v-container fluid>

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
        <v-col cols="12">
          <h4 class="text-h4">副反応疑い報告</h4>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          sm="4"
          v-for="item in items.suspected_issues.summary_items"
          :key="item.title"
        >
          <SummaryCard
            :icon="SelectIcon(item.title)"
            :tile_color="SelectTileColor(item.title)"
            :title="item.title"
            :data="item.data"
            :unit="item.unit"
          />
        </v-col>
        <v-container>
          <p>
            ※ 上記は 「
            <a :href="items.suspected_issues.source_info.url"
              >{{ items.suspected_issues.source_info.date }}:
              {{ items.suspected_issues.source_info.description }}</a
            >
            」までのデータを用いて算出しています。
          </p>
        </v-container>
      </v-row>

      <v-row>
        <div v-if="items == undefined">データ読み込み中...</div>
        <v-col v-else cols="12" sm="6">
          <apexchart
            height="400"
            type="bar"
            :options="{
              chart: { id: 'number_of_deaths_reported_by_age_group' },
              colors: ['#c83f3d'],
              title: { text: '亡くなられた方の人数（年代別）', floating: true },
              xaxis: {
                title: { text: '死亡報告数 (人)' },
                categories: items.number_of_deaths_reported_by_age_group.x_axis.data
              },
              yaxis: { title: { text: '年代' } },
              plotOptions: { bar: { horizontal: true, borderRadius: 2 } }
            }"
            :series="[
              {
                name: items.number_of_deaths_reported_by_age_group.y_axis.name,
                data: items.number_of_deaths_reported_by_age_group.y_axis.data
              }
            ]"
          ></apexchart>
        </v-col>
        <div v-if="items == undefined">データ読み込み中...</div>
        <v-col v-else cols="12" sm="6">
          <apexchart
            height="400"
            type="bar"
            :options="{
              chart: { id: 'number_of_deaths_reported_by_vaccinated_times_group' },
              colors: ['#c83f3d'],
              title: { text: '亡くなられた方の人数（接種回数別）', floating: true },
              xaxis: {
                title: { text: '死亡報告数 (人)' },
                categories: items.number_of_deaths_reported_by_vaccinated_times_group.x_axis.data
              },
              yaxis: { title: { text: '接種回数（回）' } },
              plotOptions: { bar: { horizontal: true, borderRadius: 2 } }
            }"
            :series="[
              {
                name: items.number_of_deaths_reported_by_vaccinated_times_group.y_axis.name,
                data: items.number_of_deaths_reported_by_vaccinated_times_group.y_axis.data
              }
            ]"
          ></apexchart>
        </v-col>
      </v-row>

      <v-container>
        <h4 class="text-h4">心筋炎/心膜炎 報告</h4>
        <p>
          「新型コロナワクチン接種後の心筋炎又は心膜炎疑い」として製造販売業者から報告された事例 <b>{{ carditisSummaryData?.carditis_summary.total.toLocaleString() }} [件]</b> の集計結果を示します。
        </p>

        <div class="d-flex justify-end">
          <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
          <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
        </div>

        <v-row>
          <v-col cols="12" sm="6">
            <apexchart :options="carditisSummaryOptions" :series="carditisSummarySeries"></apexchart>
          </v-col>

          <v-col cols="12" sm="6">
            <apexchart :options="myocarditisByVaccineOptions" :series="myocarditisByVaccineSeries"></apexchart>
          </v-col>

          <v-col cols="12" sm="6">
            <apexchart :options="pericarditisByVaccineOptions" :series="pericarditisByVaccineSeries"></apexchart>
          </v-col>
        </v-row>
      </v-container>

      <p class="text-caption text-right">※ 「 <a :href="carditisSummaryData?.carditis_summary.source.url">{{ carditisSummaryData?.carditis_summary.source.name }}</a> 」で
      発表された資料の <b>{{ carditisSummaryData?.carditis_summary.date }}</b> 時点の数値を用いています。</p>

    </v-container>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import SummaryCard from '../components/SummaryCard.vue'
import type { ISummaryItems } from '@/types/Summary'
import { SelectIcon } from '@/tools/SelectIcon'
import { SelectTileColor } from '@/tools/SelectTileColor'
import { AppBarTitle, AppBarColor, SummaryDataURL, CarditisSummaryURL } from '@/router/data'
import router from '@/router/index'
import type { ICarditisSummaryRoot } from '@/types/CarditisSummary'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const items = shallowRef<ISummaryItems>()
const carditisSummaryData = shallowRef<ICarditisSummaryRoot>()
onMounted(() => {
  axios
    .get<ISummaryItems>(SummaryDataURL)
    .then((response) => {
      items.value = response.data
    })
    .catch((error) => console.log('failed to get summary data: ' + error))

  axios
    .get<ICarditisSummaryRoot>(CarditisSummaryURL)
    .then((response) => {
      carditisSummaryData.value = response.data

      carditisSummarySeries.value.push(carditisSummaryData.value.carditis_summary.myocarditis)
      carditisSummarySeries.value.push(carditisSummaryData.value.carditis_summary.pericarditis)

      for (let index = 0; index < carditisSummaryData.value.carditis_issues.issues_with_vaccine_name.length; index++) {
        const issue = carditisSummaryData.value.carditis_issues.issues_with_vaccine_name[index]

        myocarditisByVaccineLabels.value.push(issue.vaccine_name)
        myocarditisByVaccineSeries.value.push(issue.myocarditis_count)

        pericarditisByVaccineLabels.value.push(issue.vaccine_name)
        pericarditisByVaccineSeries.value.push(issue.pericarditis_count)
      }
      
      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get carditis summary data: ' + error))
})

const isPersentView = shallowRef(true)

const carditisSummarySeries = shallowRef<any[]>([])
const carditisSummaryOptions = {
  title: {
    text: '心筋炎/心膜炎の内訳',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: ['心筋炎', '心膜炎'],
  colors: ['#2962FF', '#FF4081'],
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
      colors: ['#212121'],
    },
    background: {
      enabled: true,
      foreColor: '#fff',
    }
  }
}

const myocarditisByVaccineLabels = shallowRef<string[]>([])
const myocarditisByVaccineSeries = shallowRef<any[]>([])
const myocarditisByVaccineOptions = {
  title: {
    text: 'ワクチン種類ごとの心筋炎件数',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: myocarditisByVaccineLabels.value,
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0.1
      }, 
    }
  },
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
      colors: ['#212121'],
    },
    background: {
      enabled: true,
      foreColor: '#fff',
    }
  }
}

const pericarditisByVaccineLabels = shallowRef<string[]>([])
const pericarditisByVaccineSeries = shallowRef<any[]>([])
const pericarditisByVaccineOptions = {
  title: {
    text: 'ワクチン種類ごとの心膜炎件数',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: pericarditisByVaccineLabels.value,
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0.1
      }, 
    }
  },
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
      colors: ['#212121'],
    },
    background: {
      enabled: true,
      foreColor: '#fff',
    }
  }
}

const changeChartView = () => {
  isPersentView.value = !isPersentView.value
  window.dispatchEvent(new Event('resize'))
}
</script>

<style lang="scss"></style>
