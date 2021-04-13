const fs = require('fs')
const webpack = require('webpack')
/**
 * chokidar 在 fs 模块的基础上进行封装
 * 监听的功能要比 fs.watch 和 fs.watchFile 好
 */
const chokidar = require('chokidar')

/**
 * 引入热更新插件
 */ 
const hotMiddleware = require('webpack-hot-middleware')
/**
 * webpack-dev-middleware 作用是，以监听模式启动 webpack，
 * 将编译结果输出到内存中，然后将内存文件输出到 Express 服务中。
 */
const webpackDevMiddleware = require('webpack-dev-middleware')

const { resolvePath } = require('./build-utils')

class DevServer {
  serverBundle = null
  clientManifest = null
  template = null
  onReady = null
  resolve = null
  constructor(app, templatePath, callback) {
    this.onReady = new Promise(r => this.resolve = r)
    this.callback = callback

    // 监视构建 template，调用 update 更新 Renderer
    this.templateHandler(templatePath)

    // 监视构建 serverBundle，调用 update 更新 Renderer
    this.serverHandler()

    // 监视构建 clientManifest，调用 update 更新 Renderer
    this.clientHandler(app)
  }

  update() {
    if (this.serverBundle && this.template && this.clientManifest) {
      // 构建完毕，通知 server 可以 render 渲染了
      this.resolve()
      // 更新 server 中的 Renderer
      this.callback(this.serverBundle, this.template, this.clientManifest)
    }
  }

  templateHandler(templatePath) {
    const _this = this
    this.template = fs.readFileSync(templatePath, 'utf-8')
    chokidar.watch(templatePath).on('change', () => {
      _this.template = fs.readFileSync(templatePath, 'utf-8')
      console.log('template updated.')
      _this.update()
    })
  }
  
  serverHandler() {
    const _this = this
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)

    webpackDevMiddleware(serverCompiler, {
      logLevel: 'silent' // 禁止输出日志
    })
    /**
     * webpack-dev-middlewar 可以将监听 webpack 编译并将编译结构放到缓存中
     * 但是却没有提供编译的回调函数，所以这是使用注册一个webpack 插件的方法来收集编译结果
     */
    serverCompiler.hooks.done.tap('server', () => {
      _this.serverBundle = JSON.parse(
        serverCompiler.outputFileSystem.readFileSync(resolvePath('./dist/vue-ssr-server-bundle.json'), 'utf-8')
      )
      _this.update()
    })
  }

  clientHandler(app) {
    const _this = this
    const clientConfig = require('./webpack.client.config')
    // 添加热更新插件实例
    // 修改客户端 webpack 配置
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry.app = [
      'webpack-hot-middleware/client?reload=true&noInfo=true',
      clientConfig.entry.app
    ]
    clientConfig.output.filename = '[name].js'

    const clientCompiler = webpack(clientConfig)
  
    const clientDevMiddleware = webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath, // 重要！输出资源的访问路径前缀，应该和 客户端打包输出的 publicPath 一致
      logLevel: 'silent' // 禁止输出日志
    })
    /**
     * webpack-dev-middlewar 可以将监听 webpack 编译并将编译结构放到缓存中
     * 但是却没有提供编译的回调函数，所以这是使用注册一个webpack 插件的方法来收集编译结果
     */
    clientCompiler.hooks.done.tap('client', () => {
      _this.clientManifest = JSON.parse(
        clientCompiler.outputFileSystem.readFileSync(resolvePath('./dist/vue-ssr-client-manifest.json'), 'utf-8')
      )
      _this.update()
    })
  
    // 重要！将内存中的资源通过 Express 中间件对外公开访问
    app.use(clientDevMiddleware)

    // 挂载热更新的中间件
    app.use(hotMiddleware(clientCompiler, { log: false }))
  }

  static setupDevServer(app, templatePath, callback) {
    const devServer = new DevServer(app, templatePath, callback)
    return devServer.onReady
  }
}

module.exports = DevServer
