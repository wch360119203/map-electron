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
  { path: '/home', component: () => import('@/view/Home.vue') },
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
