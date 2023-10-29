export const HomeRoute = {
  path: '/',
  name: 'トップページ',
  menu_name: 'トップページ',
  icon: 'mdi-home',
  component: () => import('../views/HomeView.vue')
}
export const AboutRoute = {
  path: '/about',
  name: 'Aboutページ',
  menu_name: 'Aboutページ',
  icon: 'mdi-information-outline',
  component: () => import('../views/AboutView.vue')
}

export const SuspectedIssuesHomeRoute = {
  path: '/suspected-issues-summary',
  name: '副反応疑い報告 - 集計結果',
  menu_name: '集計結果',
  icon: 'mdi-chart-bar',
  component: () => import('../views/SuspectedIssuesView.vue')
}
export const SuspectedIssuesSubRoutes = [
  {
    path: '/reported-pfizer-issues',
    name: '副反応疑い報告 - ファイザーからの報告',
    menu_name: 'ファイザーからの報告',
    icon: 'mdi-account-search',
    component: () => import('../views/PfizerView.vue')
  },
  {
    path: '/reported-moderna-issues',
    name: '副反応疑い報告 - モデルナからの報告',
    menu_name: 'モデルナからの報告',
    icon: 'mdi-account-search',
    component: () => import('../views/ModernaView.vue')
  },
  {
    path: '/reported-myocarditis-issues',
    name: '副反応疑い報告 - 心筋炎/心膜炎報告',
    menu_name: '心筋炎/心膜炎報告',
    icon: 'mdi-account-search',
    component: () => import('../views/MyocarditisView.vue')
  },
  {
    path: '/reported-death-issues',
    name: '副反応疑い報告 - 死亡報告',
    menu_name: '死亡報告',
    icon: 'mdi-account-search',
    component: () => import('../views/DeathView.vue')
  }
]

export const HealthHazardsHomeRoute = {
  path: '/certified-health-hazard-summary',
  name: '予防接種健康被害 救済制度 - 集計結果',
  menu_name: '集計結果',
  icon: 'mdi-chart-bar',
  component: () => import('../views/CertifiedHealthHazardsHomeView.vue')
}

export const HealthHazardsSubRoutes = [
  {
    path: '/certified-health-hazard-reports',
    name: '予防接種健康被害 救済制度 - 健康被害 認定済み一覧',
    menu_name: '健康被害 認定済み一覧',
    icon: 'mdi-account-search',
    component: () => import('../views/CertifiedHealthHazardsView.vue')
  },
  {
    path: '/certified-symptoms',
    name: '予防接種健康被害 救済制度 - 健康被害 認定済み症状の一覧',
    menu_name: '健康被害 認定済み症状の一覧',
    icon: 'mdi-account-search',
    component: () => import('../views/CertifiedSymptomsView.vue')
  }
]

export const AllRoutes = [
  HomeRoute,
  AboutRoute,
  SuspectedIssuesHomeRoute,
  ...SuspectedIssuesSubRoutes,
  HealthHazardsHomeRoute,
  ...HealthHazardsSubRoutes
]
