<template>
    <div class="roles_container">
<!--      面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图-->
      <el-card>
<!--添加角色按钮-->
        <el-button type="primary" @click="addRoleDialog=true">添加角色</el-button>
        <!--        表格-->
        <el-table :data="rolesList" stripe border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="level" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
<!--      添加角色的dialog-->
      <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%" @close="addRoleDialogClose">
        <!--        dialog主题区域-->
        <el-form ref="roleDialogRef" label-width="100px" :rules="addRoleRules" :model="addRoleInfo">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleInfo.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleInfo.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
<!--编辑角色的dialog-->

<!--      删除角色的MessageBox-->

    </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表的获取
      rolesList: [],
      // 添加角色的弹框显示与否
      addRoleDialog: false,
      // 添加角色的信息
      addRoleInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取觉得列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
    },
    // 关闭添加角色的dialog
    addRoleDialogClose() {
      // 重置表单
      this.$refs.roleDialogRef.resetFields()
    },
    // 添加角色，确定按钮时
    addRole() {
      // 校验表单数据
      this.$refs.roleDialogRef.validate(async valid => {
        if (!valid) return this.$message.error('添加角色失败')
        const { data: res } = await this.$http.post('roles', this.addRoleInfo)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addRoleDialog = false
        this.getRolesList()
        this.$message.success(res.meta.msg)
      })
    },
    // 编辑角色
    editRole(row) {
      console.log(row)
      // addRoleDialog
      this.addRoleDialog = true
      this.addRoleInfo = row
      // 确认编辑的时候
    },
    // 删除角色
    async deleteRole(id) {
      const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(res => res)
      if (confirm !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRolesList()
      this.$message.success(res.meta.msg)
    }
  },
  created () {
    // 获取角色列表
    this.getRolesList()
  }

}
</script>

<style scoped>

</style>
