import { ReportedDeathIssues, ReportedMyocarditisIssues, SummaryItems } from './data';

export const HomeRoute = {
    path: '/',
    name: 'トップページ',
    icon: 'mdi-home',
    component: () => import('../views/HomeView.vue'),
    props: { items: SummaryItems }
}
export const AboutRoute = {
    path: '/about',
    name: 'About',
    icon: 'mdi-information-outline',
    component: () => import('../views/AboutView.vue')
}

export const SuspectedIssuesHomeRoute = {
	path: '/suspected-adverse-reaction-reports',
	name: '副反応疑い報告',
	icon: 'mdi-file-document-alert-outline',
	props: { items: SummaryItems },
	component: () => import('../views/SuspectedIssuesView.vue')
}
export const SuspectedIssuesSubRoutes = [
	{
    path: '/reported-myocarditis-issues',
    name: '心筋炎/心膜炎報告',
    icon: 'mdi-account-search',
    props: { items: ReportedMyocarditisIssues },
    component: () => import('../views/MyocarditisView.vue')
  },
  {
    path: '/reported-death-issues',
    name: '死亡報告',
    icon: 'mdi-account-search',
    props: { items: ReportedDeathIssues },
    component: () => import('../views/DeathView.vue')
  }
]

export const HealthProtectionHomeRoute = {
    path: '/preventive-vaccination-health-protection-system',
    name: '予防接種健康被害 救済制度',
    icon: 'mdi-medical-bag',
    props: { items: SummaryItems },
    component: () => import('../views/HealthProtectionView.vue')
}

export const AllRoutes = [
  HomeRoute,
  AboutRoute,
  SuspectedIssuesHomeRoute,
  ...SuspectedIssuesSubRoutes,
  HealthProtectionHomeRoute,
]