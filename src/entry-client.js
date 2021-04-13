import { createApp } from './app'

// 客户端特定引导逻辑……
import '@/assets/script/rem.js'
import registeRequest from '@utils/request/registe-request'

const { app, router, store } = createApp()

// 注册 request 请求
registeRequest(router, store)

import addPromission from '@utils/router-permission'
const _router = addPromission(router, store)

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

_router.onReady(() => {
  console.log('router is ready')
  app.$mount('#app')
  
  store.state.currentPath && _router.push(store.state.currentPath)
})