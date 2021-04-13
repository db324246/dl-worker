import Vuex from 'vuex'
import Vue from 'vue'
import { getCurrent } from '@/api/login'

Vue.use(Vuex)

export function createStore() {
  const store = new Vuex.Store({
    state: {
      userInfo: null,
      token: '',
      posts: [],
      currentPath: ''
    },
    mutations: {
      // 存储登陆信息
      SAVELOGININFO(state, data) {
        state.token = data.token
        state.userInfo = data.userInfo
      },
      // 清除登陆信息
      CLEARLOGININFO(state) {
        state.token = ''
        state.userInfo = {}
      },
      CURRENT_PATH(state, path) {
        state.currentPath = path
      }
    },
    actions: {
      // 应用初始化
      APPINIT({ commit }) {
        return getCurrent()
          .then(res => {
            res && commit('SAVELOGININFO', res)
          }, (err) => {
            console.log('请求错误', err)
            return Promise.reject()
          })
      }
    }
  })

  return store
}