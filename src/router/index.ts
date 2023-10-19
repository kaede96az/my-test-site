import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'
import type { ISummaryItems } from '../types/Summary'
import type { IReportedDeathIssues } from '../types/ReportedDeath'
import type { IReportedMyocarditisIssues } from '@/types/ReportedMyocarditis'

const summaryRes = await axios.get<ISummaryItems>(
  'https://gist.githubusercontent.com/kaede96az/b9102295771f6c4bf0f3e98ea2d2e6f2/raw/50897adfbc7cf21466502490df976a5619c25247/summary.json'
)
const summaryItems = summaryRes.data
const reportedDeathRes = await axios.get<IReportedDeathIssues>(
  'https://gist.githubusercontent.com/kaede96az/88e2090c0a0f81615cd37abbfb5474d0/raw/4e865fb0a6a686116e720eb4c549aed02c1f3a21/reported-death-issues.json'
)
const reportedDeathIssues = reportedDeathRes.data
const reportedMyocarditisRes = await axios.get<IReportedMyocarditisIssues>(
  'https://gist.githubusercontent.com/kaede96az/4a8008d80d5e36840e89021918cfa27e/raw/e1ec3da421d78fe1efe096ee90b27502010a769a/myocarditis.json'
)
const reportedMyocarditisIssues = reportedMyocarditisRes.data

export const routes = [
  {
    path: '/',
    name: 'Home',
    icon: 'mdi-view-dashboard-outline',
    component: HomeView,
    props: { items: summaryItems }
  },
  {
    path: '/reported-myocarditis-issues',
    name: '心筋炎/心膜炎報告',
    icon: 'mdi-account-alert',
    props: { items: reportedMyocarditisIssues },
    component: () => import('../views/MyocarditisView.vue')
  },
  {
    path: '/reported-death-issues',
    name: '死亡報告',
    icon: 'mdi-heart-off',
    props: { items: reportedDeathIssues },
    component: () => import('../views/DeathView.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    icon: 'mdi-information-outline',
    component: () => import('../views/AboutView.vue')
  }
]

//console.log('BASE_URL: ', import.meta.env.BASE_URL)

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
