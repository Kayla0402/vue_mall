/*
* 当打包构建项目时，js包会变得非常大，影响页面加载，
* 如果我们能把不同的路由对应的组件分割成不同的代码块，然后当路由被访问时才加载对应的组件，更高效
* 1.安装@babel/plugin-syntax-dynamic-import
* 2.babel.config.js中配置该插件
* 3.更改路由的按需加载
* webpackChunkName相同名称的会打包到一起
* 最终build的时候可以看到app.js和chuck.js会变小
* */
import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')
// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'

// import Users from '../components/users/Users'
// import Rights from '../components/rights/Rights'
// import Roles from '../components/roles/Roles'
const Users = () => import(/* webpackChunkName: "rights_users" */ '../components/users/Users')
const Rights = () => import(/* webpackChunkName: "rights_users" */ '../components/rights/Rights')
const Roles = () => import(/* webpackChunkName: "rights_users" */ '../components/roles/Roles')

// import Categories from '../components/categories/Categories'
// import Params from '../components/params/Params'
const Categories = () => import(/* webpackChunkName: "categoriese_params" */ '../components/categories/Categories')
const Params = () => import(/* webpackChunkName: "categoriese_params" */ '../components/params/Params')

// import Add from '../components/goods/Add'
// import Goods from '../components/goods/Goods'
const Add = () => import(/* webpackChunkName: "add_goods" */ '../components/goods/Add')
const Goods = () => import(/* webpackChunkName: "add_goods" */ '../components/goods/Goods')

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
      { path: '/goods/add', component: Add },
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
