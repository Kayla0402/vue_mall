import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/rights/Rights'
import Roles from '../components/roles/Roles'
import Goods from '../components/goods/Goods'
import Categories from '../components/categories/Categories'
import Params from '../components/params/Params'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  // 如果是home路由的话会首先重定向到welcome路由，且Welcome组件去取代Home组件中的路由占位符
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/welcome', component: Welcome },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params }]
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
