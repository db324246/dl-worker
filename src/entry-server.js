import { createApp } from './app'
import addPromission from '@utils/router-permission'
import registeRequest from '@utils/request/registe-request'

export default async context => {
  const { app, router, store } = createApp()

  const meta = app.$meta()

  // 注册 request 请求
  registeRequest(router, store, true)
  const _router = addPromission(router, store, true)

  // 设置服务器端 router 的位置
  _router.push(context.url)

  // 将 meta 信息注入到上下文
  context.meta = meta

  // 等到 router 将可能的异步组件和钩子函数解析完
  await new Promise(_router.onReady.bind(_router))

  // Promise 结束后传递 应用程序实例，以便它可以渲染
  context.rendered = () => {
    // Renderer 会把 context.state 数据对象内联到页面模板中
    // 最终发送给客户端的页面中会包含一段脚本：window.__INITIAL_STATE__ = context.state
    // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端 store 容器中
    context.state = store.state
  }

  return app
}