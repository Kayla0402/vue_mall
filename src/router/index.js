import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/home', component: Home
  }

]

const router = new VueRouter({
  routes
})
/*
* 需要用导航守卫监测有没有登录，如果已经登录了则直接放行，否则就跳转至登录页面
* */
router.beforeEach((to, from, next) => {
  /*
  * to 将要访问的路径
  * from 代表从哪个路径跳转而来
  * next 是一个函数，表示放行
  * next() 放行 next('/login')强制跳转至login路由
  * */
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
