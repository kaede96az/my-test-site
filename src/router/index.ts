import { createRouter, createWebHashHistory } from 'vue-router'
import { AllRoutes } from './routes'

//console.log('BASE_URL: ', import.meta.env.BASE_URL)

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: AllRoutes
})

export default router
