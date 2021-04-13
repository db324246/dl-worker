// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css'// progress bar style

// NProgress.configure({ showSpinner: false })// NProgress Configuration

export default (router, store, isServer = false) => {
  const whitePathList = ['/', '/login', '/favicon.ico']
  
  // 添加路由导航守卫
  router.beforeEach((to, from, next) => {
    
    // NProgress.start()
    if (whitePathList.includes(to.path)) {
      isServer && store.commit('CURRENT_PATH', to.path)
      return next()
      // return NProgress.done()
    }
  
    // 没有token 的情况下先进行项目初始化
    if (!store.state.token) {
      return store.dispatch('APPINIT')
        .then(() => {
          isServer && store.commit('CURRENT_PATH', to.path)
          next()
          // NProgress.done()
        }, err => {
          console.log('error', err)
          // NProgress.done()
        })
    }
  
    if (to.query.redirectPath) {
      isServer && store.commit('CURRENT_PATH', to.query.redirectPath)
      next(to.query.redirectPath)
      // NProgress.done()
    } else {
      isServer && store.commit('CURRENT_PATH', to.path)
      next()
      // NProgress.done()
    }
  })

  const push = router.push
  router.push = function(...arg) {
    const p = push.call(this, ...arg)
    p && p.catch(() => {})
  }
  const replace = router.replace
  router.replace = function(...arg) {
    const p = replace.call(this, ...arg)
    p && p.catch(() => {})
  }

  return router
}
