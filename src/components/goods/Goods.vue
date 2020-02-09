<template>
    <div class="goods_container">
      <!--      面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--      卡片-->
      <el-card class="box-card">
        <!--        布局-->
        <el-row :gutter="20">
          <!--          搜索框-->
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goAddPage">添加商品</el-button>
          </el-col>
        </el-row>
<!--        商品列表展示-->
        <el-table :data="goods" border stripe style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="140px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="130px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
<!--        分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5,10,15,20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Goods',
  data() {
    return {
      // 查询商品列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表
      goods: [],
      // 总条数
      total: 0
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.goods = res.data.goods
      this.total = res.data.total
    },
    // 分页的函数--每页 ${val} 条
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 分页的函数--当前页: ${val}
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 删除商品
    delById(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getGoodsList()
        this.$message.success(res.meta.msg)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加商品，跳转到新的页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style scoped>

</style>
