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
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
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
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
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
<!--      添加用户的提示框Dialog-->
      <el-dialog @close="addDialogClose" title="提示" :visible.sync="addUserDialog" width="50%">
<!--        dialog主题区域-->
        <el-form ref="addDialogRef" label-width="70px" :rules="addUserRules" :model="addUserInfo">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addUserInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserInfo.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    // 自定义手机号码的校验规则
    var checkTel = (rule, value, cb) => {
      const regTel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regTel.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码444'))
    }
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的邮箱444'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页展示多少条
        pagesize: 2
      },
      userList: [],
      // 总用户数量
      total: 0,
      // 添加用户的提示框的显示与隐藏
      addUserDialog: false,
      // 添加用户的表单信息
      addUserInfo: {
        username: '',
        mobile: '',
        email: '',
        password: ''
      },
      // 添加用户的表单验证
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // console.log(res)
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
    },
    // 更新用户的状态，先获取用户的状态，请求接口，更改状态的数据
    async userStateChanged(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        // 添加用户失败// return直接返回，不往下进行 ，切switch状态不改变
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 添加用户表单关闭，重置表单数据
    addDialogClose() {
      this.$refs.addDialogRef.resetFields()
    },
    // 添加用户确认按钮点击
    addUser() {
      // 不能直接发起请求，需先对form表单进行校验，所以的校验通过之后再请求
      this.$refs.addDialogRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 校验通过，发起请求
        const { data: res } = await this.$http.post('users', this.addUserInfo)
        if (res.meta.status !== 201) this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 添加用户成功会关闭对话框
        this.addUserDialog = false
        // 添加了用户之后要刷新数据，重新获取用户列表的最新信息
        this.getUserList()
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style scoped>

</style>
