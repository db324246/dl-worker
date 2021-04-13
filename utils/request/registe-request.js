import request from '@utils/request'
import { Notify, Dialog } from 'vant'

export default function registeRequest(router, store, isServer = false) {
  if (isServer) {
    request.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://daiter.cn:3000/dlWokerSever' : 'http://localhost:3000/dlWokerSever'
    request.defaults.withCredentials = true
  }

  const errorHandle = (status, message) => {
    switch (status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        Notify({
          type: 'danger',
          message
        })
        router.replace({
          path: '/login',
          query: { redirectPath: router.currentRoute.path }
        }).catch(err => {})
        break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
      case 403:
        Dialog.alert({
          title: '提示',
          message: '登录过期，请重新登录',
        }).then(() => {
          store.commit('CLEARLOGININFO')
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          router.replace({
            path: '/login',
            query: { redirectPath: router.currentRoute.path }
          }).catch(err => {})
        });
        break
        // 404请求不存在
      case 404:
        Notify({
          type: 'danger',
          message: '网络请求不存在'
        })
        break
        // 其他错误，直接抛出错误提示
      default:
        Notify({
          type: 'danger',
          message
        })
    }

    return Promise.reject(message)
  }
  
  // 请求拦截器
  request.interceptors.request.use(
    config => {
      // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      
      const storeToken = isServer ? process.env.USER_TOKEN : store.state.token
      const cookies = process.env.USER_COOKIE

      if (storeToken) {
        config.headers.Authorization = storeToken
      }
      if (isServer && cookies) {
        config.headers.cookie = cookies
      }
      return config
    },
    error => {
      return Promise.error(error)
    })
  
  // 响应拦截器
  request.interceptors.response.use(
    response => {
      if (!response) return Promise.reject('请求不存在')
      
      const { status, data, message } = response.data
  
      if (status === 200) {
        return Promise.resolve(data)
      }

      return errorHandle(status, message)
    },
    // 服务器状态码不是200的情况
    // eslint-disable-next-line consistent-return
    error => {
      // if (error.response.status) {
      //   errorHandle(error.response.status, error.response.msg)
      //   return Promise.reject(response)
      //   // eslint-disable-next-line no-else-return
      // } else {
      //   // 处理断网的情况
      //   // eg:请求超时或断网时，更新state的network状态
      //   // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      //   // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      //   if (!window.navigator.onLine) {
      //     // store.commit('changeNetwork', false)
      //   } else {
      //     return Promise.reject(error)
      //   }
      // }
    }
  )
}