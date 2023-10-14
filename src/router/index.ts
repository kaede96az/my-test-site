import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'
import type { ISummaryItems } from '@/types/Summary'
import type { IReportedDeathIssues } from '@/types/ReportedDeath'

// todo: 本番リポジトリに行く際には、いろいろパス修正が必要（my-test-site -> new-repo-name）

const summaryRes = await axios.get<ISummaryItems>('https://kaede96az.github.io/my-test-site/datasets/summary.json')
const summaryItems = summaryRes.data
const reportedDeathRes = await axios.get<IReportedDeathIssues>(
  'https://gist.githubusercontent.com/kaede96az/88e2090c0a0f81615cd37abbfb5474d0/raw/4e865fb0a6a686116e720eb4c549aed02c1f3a21/reported-death-issues.json'
)
const reportedDeathIssues = reportedDeathRes.data

export const routes = [
  {
    path: '/my-test-site',
    name: 'Home',
    icon: 'mdi-view-dashboard-outline',
    component: HomeView,
    props: { items: summaryItems }
  },
  {
    path: '/my-test-site/reported-death-issues',
    name: '死亡報告',
    icon: 'mdi-heart-off',
    props: { items: reportedDeathIssues },
    component: () => import('../views/DeathView.vue')
  },
  {
    path: '/my-test-site/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    icon: 'mdi-information-outline',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
