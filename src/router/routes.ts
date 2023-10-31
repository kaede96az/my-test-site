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
  },
  {
    path: '/reported-pfizer-issues',
    name: '副反応疑い報告 - ファイザーの報告',
    menu_name: 'ファイザーの報告',
    icon: 'mdi-account-search',
    component: () => import('../views/PfizerView.vue')
  },
  {
    path: '/reported-moderna-issues',
    name: '副反応疑い報告 - モデルナの報告',
    menu_name: 'モデルナの報告',
    icon: 'mdi-account-search',
    component: () => import('../views/ModernaView.vue')
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
    path: '/certified-issues',
    name: '予防接種健康被害 救済制度 - 認定済み 報告一覧',
    menu_name: '認定済み 報告一覧',
    icon: 'mdi-account-search',
    component: () => import('../views/CertifiedHealthHazardsView.vue')
  },
  {
    path: '/certified-symptoms',
    name: '予防接種健康被害 救済制度 - 認定済み 症状一覧',
    menu_name: '認定済み 症状一覧',
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
