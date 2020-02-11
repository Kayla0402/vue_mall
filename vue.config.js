// vue-cli3 工具 生成的项目，默认隐藏了webpack的默认配置
module.exports = {
  // 通过chainWebpack 自定义打包入口，将开发和生产环境的打包入口的文件分开
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      /*
      *  externals --项目优化策略--加载外部CDN资源，使打包出来的项目体积更小点
      * 默认情况下，通过import语法导入的第三方依赖包，最终都会被打包合并到同一文件中，从而导致打包成功后，单文件体积过大的问题
      * 可视化ui面板，build，生成资源的目录中，js/chunk-vendors.d2737f56.js的文件体积特别大，所有import导入的包都会合并到这个文件中，优化这个文件的体体积就用externals,把那些文件体积较大的第三方库抽离出去
      * 通过webpack的externals节点，来配置并加载外部的CDN资源，凡是声明在externals中的第三方依赖包都不会被打包，
      * 打包时webpack会先检查程序员有没有在externals中声明一些第三方的依赖包，如果有的话webpack就不会把这些第三方的依赖包打包到chunk的文件中，而是在用到这些依赖包的时候，直接去window全局对象上找现成的对象来进行使用
      * 1.而只有在发布模式才需要优化
      * 2.需要在public/index.html文件的头部，添加CDN资源的引用（包括nprogress和quill等的样式表）从main-prod.js中剪切过去
      * 3.需要在public/index.html文件的头部，添加外部CDN资源的引用---js
      * 用externals优化elementUi，
      * 1.在main-prod中注释elementUi的加载代码
      * 2.在index头部引入element的js和css文件
      * */
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      /*
      *  设置发布模式和开发模式下不同的标题，且按需加载第三方的库，发布模式从线上CDN进行加载
      *  打包后的文件是用于部署发布模式，在dist下的index.html文件中，此时能看得到第三方文件的加载
      *  如果是开发模式，则网页中审查源代码可以发现并没有第三方库的加载，都是从本地加载的
      * */
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
