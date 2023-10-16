import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'
import type { ISummaryItems } from '../types/Summary'
import type { IReportedDeathIssues } from '../types/ReportedDeath'

const summaryRes = await axios.get<ISummaryItems>(
  'https://gist.githubusercontent.com/kaede96az/b9102295771f6c4bf0f3e98ea2d2e6f2/raw/84bd522c24d6ef2209e15fa5868e95a3d7b8127f/summary.json'
)
const summaryItems = summaryRes.data
const reportedDeathRes = await axios.get<IReportedDeathIssues>(
  'https://gist.githubusercontent.com/kaede96az/88e2090c0a0f81615cd37abbfb5474d0/raw/4e865fb0a6a686116e720eb4c549aed02c1f3a21/reported-death-issues.json'
)
const reportedDeathIssues = reportedDeathRes.data

export const routes = [
  {
    path: '/',
    name: 'Home',
    icon: 'mdi-view-dashboard-outline',
    component: HomeView,
    props: { items: summaryItems }
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
