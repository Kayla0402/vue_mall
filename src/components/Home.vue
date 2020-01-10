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
        <el-menu :collapse="isCollapsed" :collapse-transition="false" :unique-opened="true" background-color="#333744" text-color="#fff" active-text-color="#409eff">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="i.id+''" v-for="i in item.children" :key="i.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{i.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapsed: false
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
    toggleCollapse () {
      console.log(111)
      this.isCollapsed = !this.isCollapsed
    }
  },
  // 页面一加载就开始请求侧边栏数据，在created(){}中
  created () {
    this.getMenuList()
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
