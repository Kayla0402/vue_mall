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
        <el-button type="primary" @click="addCateDialog=true">添加分类</el-button>
        <!--        用户列表-->
        <el-table :data="cateList" style="width: 100%" border stripe>
          <el-table-column type="index" width="70px"></el-table-column>
          <el-table-column prop="cat_name" label="分类名称"></el-table-column>
          <el-table-column prop="cat_deleted" label="是否有效">
            <el-button icon="el-icon-check" circle></el-button>
          </el-table-column>
          <el-table-column prop="cat_level" label="排序">
            <el-tag>一级</el-tag>
          </el-table-column>
          <!--分配角色-->
          <el-table-column label="操作" min-width="180">
            <template>
              <!--编辑按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <!--删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      <el-dialog @close="addCateClose" title="添加分类信息" :visible.sync="addCateDialog" width="50%">
        添加分类
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialog = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
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
        pagesize: 2
      },
      // 总分类的数量
      total: 0,
      // 添加分类dialog显示o
      addCateDialog: false,
      // 分类的所有数据
      cateList: []
    }
  },
  methods: {
    // 添加分类dialog关闭
    addCateClose() {
      console.log(11)
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
</style>
