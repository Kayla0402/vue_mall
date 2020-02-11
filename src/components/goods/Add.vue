<template>
  <div class="addGoods_container">
<!--    面包屑导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片-->
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
<!--      步骤条-->
      <el-steps :active="activeIndex - 0" finish-status="success" :space="200" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
<!--      左侧的标签页 el-tab-pane 只能作为el-tabs的子节点-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
<!--    :before-leave值是个方法，但是本身是属性，不用@用： @tab-click 是方法所以前边是@  -->
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat" clearable
                :options="cateList"
                :props="{ expandTrigger: 'hover', children:'children', value:'cat_id', label:'cat_name' }"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="i" size="mini" border  v-for="(i,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            商品参数
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTabData" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条当前项
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类列表---级联选择器的选中值数组
        goods_cat: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      cateList: [],
      // 级联选择器选中项
      // selectedKeys: []
      // 商品参数数据
      // 商品参数
      manyTabData: [],
      // 商品属性
      onlyTabData: {}
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.cateList = res.data
    },
    // 级联选择器变化的触发函数
    handleChange() {
      // console.log(this.addForm.goods_cat)
      // 设置只能选中三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换标签页
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName + '+++++++++++' + oldActiveName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 获取商品参数列表
    async tabClicked() {
      // 判断切换到哪个tab标签，进而判断发起哪个请求，请求哪个数据
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // console.log(res)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
      }
      // 商品属性
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTabData = res.data
        // console.log(this.onlyTabData)
      }
      // 商品图片
      if (this.activeIndex === '3') {
        // const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // this.onlyTabData = res.data
      }
    }
  },
  created() {
    this.getCateList()
  },
  // 计算属性
  computed: {
    // 分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-steps{margin: 10px 0}
.el-step__title{font-size: 13px}
.el-checkbox{
    margin: 0 10px 0 0;
  }
</style>
