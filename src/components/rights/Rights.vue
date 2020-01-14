<template>
    <div class="rights_container">
<!--      面包屑功能-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图-->
      <el-card>
<!--        表格-->
        <el-table :data="rightsList" stripe border style="width: 100%">
          <el-table-column type="index" width="70"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
              <el-tag type="success" v-else-if="scope.row.level==='1'">标签一</el-tag>
              <el-tag type="warning" v-else>标签一</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  methods: {
    // 获取所有的权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
    }
  },
  created () {
    // 获取所有的权限列表
    this.getRightsList()
  }
}
</script>

<style scoped>

</style>
