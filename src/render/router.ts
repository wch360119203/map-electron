import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: () => import('@/view').then((mod) => mod.HomeVue),
  },
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
