<template>
  <el-container class="home_container">
    <el-header>
      <div class="home_header_left">
        <img class="avator" src="../assets/avator.png" alt=""/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed?'64px':'200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <el-menu :default-active="activePath" :router="true" :collapse="isCollapsed" :collapse-transition="false"
                 :unique-opened="true" background-color="#333744" text-color="#fff" active-text-color="#409eff">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+i.path" v-for="i in item.children" :key="i.id" @click="saveNavState('/'+i.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{i.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 侧边栏数据
      menuList: [],
      // 侧边栏的图标对象
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 左边菜单是否折叠
      isCollapsed: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    loginOut () {
      /*
        1.清空token值，2.返回login页面重新登录
        */
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 侧边栏数据的获取
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 折叠侧边栏
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    // 保存链接的激活状态（刷新页面）
    saveNavState(path) {
      console.log(path)
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  // 页面一加载就开始请求侧边栏数据，在created(){}中
  created () {
    this.getMenuList()
    // 二级菜单的高亮显示
    this.activePath = sessionStorage.getItem('activePath')
  }
}
</script>

<style scoped>
  .home_container {
    height: 100%;
  }
  .home_header_left {
    display: flex;
    align-items: center;
  }
  .home_header_left span{
    margin-left: 20px;
    font-weight: bold;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-aside ul{
    border-right: none;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .el-header {
    padding-left: 0;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-btn {
    line-height: 30px;
    color: #fff;
    background-color: #4a5064;
    text-align: center;
    cursor: pointer;
  }

</style>
