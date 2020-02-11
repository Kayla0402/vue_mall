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
// 进度条的导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 树形图
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)
/*
* 全局时间格式化过滤器
* dateFormat--过滤器的名称，function为处理函数，function的参数为原始数据
* dt.getMonth() + 1 + ''--将月份转为字符串，
* padStart(参1，参2）为字符串的方法，参1为总长度要求多少位，参2的意思是不足总长度用参2补齐
* */
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // return `yyyy-mm-dd hh:mm:ss`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// axios.defaults.baseURL = 'http://renoblog.xyz/api/private/v1/'
axios.defaults.baseURL = 'http://39.106.149.154:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://119.3.183.37:8888/api/private/v1/'
// 请求拦截器，对发起请求的一个预处理
// 在request拦截器中，展示进度条 NProgress.start（）
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  // config为请求对象，config.header为请求头的信息
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后一定要返回config，固定写法
  return config
})
// 在response拦截器中，展示进度条 NProgress.done（）
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
