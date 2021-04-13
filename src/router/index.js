import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/views/Layout'

Vue.use(VueRouter)

export function createRouter() {
  const router = new VueRouter({
    mode: 'history', // 同构应用不能使用 hash 路由，应该使用 history 模式
    routes: [
      {
        path: '/',
        redirect: '/home',
        name: 'base',
        component: layout,
        children: [
          {
            path: 'home',
            name: 'home-page',
            component: () => import('@/views/home')
          },
          { path: 'about', name: 'about', component: () => import('@/views/About') }
        ]
      },
      {
        path: '/login',
        name: 'login-page',
        component: () => import('@/views/login')
      },
      {
        path: '/register',
        name: 'register-page',
        component: () => import('@/views/register')
      },
      { path: '*', name: '404', component: () => import('@/views/404') }
    ]
  })

  return router
}
