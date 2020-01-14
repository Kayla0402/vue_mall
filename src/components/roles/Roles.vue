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
<!--          展开列-->
          <el-table-column type="expand" width="50">
            <template slot-scope="scope">
              <el-row :class="['bdBottom','vcen',i1===0?'bdTop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
<!--         一级菜单-->
                <el-col  :span="5">
                  <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
<!--              二级和三级菜单-->
                <el-col :span="19">
                  <!--通过for循环嵌套渲染二级和三级菜单-->
                  <el-row  :class="[i2===0?'':'bdTop','vcen']" v-for="(item2,i2) in item1.children" :key="item2.id">
<!--                    第二级菜单-->
                    <el-col :span="6">
                      <el-tag type="success" @close="removeRightById(scope.row,item2.id)" closable>{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
<!--                    第三级菜单-->
                    <el-col :span="18">
                      <el-tag type="warning" @close="removeRightById(scope.row,item3.id)" closable v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="level" label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog">分配权限</el-button>
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

<!--      删除下拉权限的MessageBox-->
<!--      分配权限的对话框dialog-->
      <el-dialog title="分配权限" :visible.sync="showRightDialogVisible" width="50%">
        <!--        dialog主题区域-->
       11111
      </el-dialog>

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
      },
      // 显示分配权限的对话框
      showRightDialogVisible: false
    }
  },
  methods: {
    // 获取角色列表
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
    },
    // 删除一，二，三级分类的标签
    async removeRightById(scope, id) {
      // 弹出是否删除的弹框MessageBox
      const confirmResult = await this.$confirm('是否删除该权限?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${scope.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      scope.children = res.data
      // this.getRolesList()
      // 页面会完整渲染，关闭下拉框
      this.$message.success(res.meta.msg)
    },
    // 展示分配权限的对话框
    async showSetRightDialog() {
      // 获取到所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      this.showRightDialogVisible = true
    }
  },
  created () {
    // 获取角色列表
    this.getRolesList()
  }

}
</script>

<style scoped>
.el-tag{
  margin: 7px;
}
  .bdTop{
    border-top: 1px solid #eee;
  }
.bdBottom{
  border-bottom: 1px solid #eee;
}
  .vcen{
    display: flex;
    align-items: center;
  }
</style>
