/**
 * 服务端入口，仅运行于服务端 
 */
const fs = require('fs')
const path = require('path')
const Vue = require('vue')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const server = express()

server.use('/dist', express.static(path.resolve(__dirname, './dist/')))

const isProd = process.env.NODE_ENV === 'production'
const { createBundleRenderer } = require('vue-server-renderer')
const templatePath = './index.template.html'
const setupDevServer = require('./build/setup-dev-server.js').setupDevServer

let renderer, devServer

if (isProd) {
  // 生产模式，直接基于已构建好的包创建渲染器
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')

  renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template,
    clientManifest // （可选）客户端构建 manifest
  })
} else {
  /**
   * 开发模式
   * 打包构建（客户端 + 服务端)
   * ↓
   * 创建渲染器
   * 模板 + 客户端 bundle + 服务端 bundle
   * 改变 -> 从新生成渲染器
   * 源码改变
   * 打包客户端 Bundle + 服务端 Bundle
   * devServer 是一个 Promise,当它完成的时候意味着初始构建已完成
   */

  devServer = setupDevServer(server, templatePath, (serverBundle, template, clientManifest) => {
    console.log('更新渲染器')
    renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false, // 推荐
      template,
      clientManifest // （可选）客户端构建 manifest
    })
  })
}

const filter = function (pathname, req) {
  console.log('监听代理', pathname)
  return true
};

// 开启服务代理
server.use('/dlWokerSever', createProxyMiddleware(filter, {
  target: process.env.NODE_ENV === 'production' ? 'http://daiter.cn:3000' : 'http://localhost:3000',
  changeOrigin: true
}))

// render 函数
const render = (req, res) => {
  const context = {
    url: req.url
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`${html}`)
  })
}

server.get('*', (req, res) => {
  const cookie = req.headers.cookie
  if (cookie) {
    const token_cookie = cookie.split(';')
      .map(i => i.trim())
      .find(i => i.startsWith('@token='))
    const token = token_cookie ? token_cookie.split('=')[1] : ''

    process.env.USER_COOKIE = cookie
    process.env.USER_TOKEN = token
  }

  const handler = isProd ? render : async (req, res) => {
    try {
      await devServer
    } catch (error) {
      console.log('render error', error)
    }
    render(req, res)
  }

  handler(req, res)
})

server.listen(8080, () => {
  console.log('listen on port 8080.')
})
