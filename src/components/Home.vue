<template>
  <div class="home">
    <el-button type="info" @click="loginOut">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    loginOut () {
      /*
       1.清空token值，2.返回login页面重新登录
       */
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
