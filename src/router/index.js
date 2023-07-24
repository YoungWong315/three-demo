import * as vueRouter from 'vue-router'
import RouterGuard from './routerGuard'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/Index.vue'),
  },
  {
    path: '/tricube',
    name: 'TriCube',
    component: () => import('@/views/TriCube.vue'),
  },
  {
    path: '/model',
    name: 'Model',
    component: () => import('@/views/Model.vue'),
  },
]

const router = vueRouter.createRouter({
  // history: vueRouter.createWebHistory('/sjut/'),
  history: vueRouter.createWebHistory(),
  routes,
  // 只有一级路由可以使用
  scrollBehavior(to, from, savedPosition) {
    // keep-alive 的组件，保留滚动位置
    if (savedPosition && to.meta.keepAlive && to.meta.keepAlive != undefined) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

new RouterGuard(router).start()

export default router
