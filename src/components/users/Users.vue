<template>
    <div class="user_container">
<!--      面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片-->
      <el-card class="box-card">
<!--        布局-->
        <el-row :gutter="20">
<!--          搜索框-->
          <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
<!--        用户列表-->
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <!--作用域插槽，定义成scope，且通过scope.row获取这一行的数据，且作用域插槽会覆盖prop-->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state">
              </el-switch>
            </template>
          </el-table-column>
          <!--分配角色-->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-table-column label="操作" min-width="180">
              <template>
                <!--编辑按钮-->
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <!--删除按钮-->
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                <!--分配角色按钮-->
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </template>
            </el-table-column>
          </el-tooltip>
        </el-table>
<!--        分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页展示多少条
        pagesize: 1
      },
      userList: [],
      // 总用户数量
      total: 0
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 分页--pageSize 改变时会触发--切换一页展示多少条数据的时候
    handleSizeChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagesize = newPage
      this.getUserList()
    },
    // 分页--currentPage 改变时会触发--切换第几页数据展示的时候
    handleCurrentChange(page) {
      console.log(page)
      this.queryInfo.pagenum = page
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style scoped>

</style>
