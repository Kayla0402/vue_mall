import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font/iconfont.css'
// axios
import axios from 'axios'
// 树形图
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// axios.defaults.baseURL = 'http://renoblog.xyz/api/private/v1/'
axios.defaults.baseURL = 'http://39.106.149.154:8888/api/private/v1/'
// 请求拦截器，对发起请求的一个预处理
axios.interceptors.request.use(config => {
  // config为请求对象，config.header为请求头的信息
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后一定要返回config，固定写法
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
