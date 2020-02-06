<template>
    <div class="categories_container">
      <!--      面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!--      卡片-->
      <el-card class="box-card">
        <!--        添加按钮-->
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        <!--        用户列表-->
<!--        <el-table :data="cateList" style="width: 100%" border stripe>-->
<!--          <el-table-column type="index" width="70px"></el-table-column>-->
<!--          <el-table-column prop="cat_name" label="分类名称"></el-table-column>-->
<!--          <el-table-column prop="cat_deleted" label="是否有效">-->
<!--            <el-button icon="el-icon-check" circle></el-button>-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="cat_level" label="排序">-->
<!--            <el-tag>一级</el-tag>-->
<!--          </el-table-column>-->
<!--          &lt;!&ndash;分配角色&ndash;&gt;-->
<!--          <el-table-column label="操作" min-width="180">-->
<!--            <template>-->
<!--              &lt;!&ndash;编辑按钮&ndash;&gt;-->
<!--              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>-->
<!--              &lt;!&ndash;删除按钮&ndash;&gt;-->
<!--              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
        <!-- 表格 用tree-table代替el-table，？？？？不知道为啥这么替换-->
        <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
<!--          是否有效-->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red;"></i>
          </template>
<!--          排序-->
          <template slot="sort" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
            <el-tag v-else size="mini" type="warning">三级</el-tag>
          </template>
<!--          操作-->
          <template slot="operate">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </tree-table>
        <!--        分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
<!--添加分类的dialog-->
      <el-dialog @close="addCateDialogClose" title="添加分类信息" :visible.sync="addCateDialogVisible" width="50%">
<!--        添加分类的表单-->
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
              <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                clearable
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                  children: 'children',
                  checkStrictly: true
                }"
                @change="parentCateChange">
              </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary"  @click="addCateDialog">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      // 查询分类列表参数
      queryInfo: {
        type: 3,
        // 当前页数
        pagenum: 1,
        // 每页展示多少条
        pagesize: 5
      },
      // 总分类的数量
      total: 0,
      // 添加分类dialog显示o
      addCateDialogVisible: false,
      // 分类的所有数据
      cateList: [],
      // 树状图的每一列的数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: ''
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          width: '',
          // 模板插槽
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          width: '',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          prop: '',
          width: '',
          type: 'template',
          template: 'operate'
        }
      ],
      // 将要添加分类的表单数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 添加数据的父级分类的数据列表
      parentCateList: [],
      // 级联选择器选中的值,必须是数组
      selectedKeys: []

    }
  },
  methods: {
    // 添加分类dialog关闭--关闭对话框，重置所有的表单数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      // 重置Cascader 级联选择器的选中项
      this.selectedKeys = []
      // 重置表单的数据
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 分类数据的获取
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
      // console.log(res)
    },
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage
      this.getCateList()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getCateList()
    },
    // 添加分类事件
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取添加事件的父级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('添加数据的父级分类数据获取失败')
      this.parentCateList = res.data
    },
    // 选择项发生变化的触发项
    parentCateChange() {
      // 如果selectedKeys数组中的length>0，选中了父级分类，反之没有选中任何分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前父级分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return true
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 确认添加分类数据
    async addCateDialog() {
      // 点击确认按钮时先进性表单的预验证
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类数据失败')
        this.$message.success('添加分类数据成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style scoped>
  .el-button.is-circle{
    padding: 0;
    background-color: cadetblue;
    color: #fff;
    border: 1px solid cadetblue
  }
  .el-cascader{
    width: 100%;
  }
</style>
