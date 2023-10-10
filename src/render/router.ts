import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/view').then((mod) => mod.HomeVue),
  },
  {
    path: '/file',
    name: 'file',
    component: () => import('@/view').then((mod) => mod.FileManager),
  },
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
