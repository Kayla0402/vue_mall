<template>
    <div class="params_container">
      <!--      面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      卡片视图区域-->
      <el-card class="box-card">
        <!--        提示-->
        <el-alert
          title="注意：只允许为第三级分类设置相关参数"
          type="warning"
          show-icon
          :closable="false">
        </el-alert>
        <!--        选择分类-->
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类:</span>
            <el-cascader
              size="mini"
              v-model="selectedKeys"
              :options="cateList"
              clearable
              :props="cateProps"
              @change="handleChange">
            </el-cascader>
          </el-col>
          <el-col>
          </el-col>
        </el-row>
        <!--        参数-->
        <el-tabs v-model="activeParamsName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" @click="addDataDialog = true" :disabled="isBtnDisabled" size="mini">添加参数</el-button>
            <el-table :data="manyTabData" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag :key="i"
                    v-for="(tag, i) in scope.row.attr_vals" closable
                    :disable-transitions="false"
                    @close="handleClose(tag,scope.row)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column property="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.attr_id)">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="delData(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" @click="addDataDialog = true" :disabled="isBtnDisabled" size="mini">添加属性</el-button>
            <el-table :data="onlyTabData" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag :key="i"
                          v-for="(tag, i) in scope.row.attr_vals" closable
                          :disable-transitions="false"
                          @close="handleClose(tag,scope.row)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column property="attr_name" label="属性名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"  @click="edit(scope.row.attr_id)">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="delData(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>
      </el-card>
<!--      添加动态参数和静态属性对话框   因为标题都是动态的，所以要用计算属性-->
      <el-dialog :title="'添加：'+titleText" :visible.sync="addDataDialog" width="50%" @close="addDataDialogClose">
        <!--        dialog主题区域-->
        <el-form ref="addDataDialogRef" label-width="70px" :rules="addDataRules" :model="addDataInfo">
          <el-form-item :label="titleText" prop="attr_name" label-width="100px">
            <el-input v-model="addDataInfo.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDataDialog = false">取 消</el-button>
          <el-button type="primary" @click="addData">确 定</el-button>
        </span>
      </el-dialog>
<!--      修改属性和参数的对话框-->
      <el-dialog :title="'修改：'+titleText" :visible.sync="editDataDialog" width="50%" @close="editDataDialogClose">
        <!--        dialog主题区域-->
        <el-form ref="editDataDialogRef" label-width="70px" :rules="editDataRules" :model="editDataInfo">
          <el-form-item :label="titleText" prop="attr_name" label-width="100px">
            <el-input v-model="editDataInfo.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDataDialog = false">取 消</el-button>
          <el-button type="primary" @click="editData">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择器选中的值,必须是数组
      selectedKeys: [],
      // 级联选择器配置对象
      cateProps: {
        value: 'cat_id',
        expandTrigger: 'hover',
        label: 'cat_name',
        children: 'children'
      },
      // tab标签的选中项
      activeParamsName: 'many',
      // tab标签的数据
      manyTabData: [],
      onlyTabData: [],
      // 添加参数
      addDataInfo: {
        attr_name: ''
      },
      // 添加参数的dialog显示与隐藏
      addDataDialog: false,
      // 添加参数的dialog参数信息验证规则
      addDataRules: {
        attr_name: [
          { required: true, message: '请输入要添加的参数', trigger: 'blur' }
        ]
      },
      // 修改参数和属性对话框的显示与隐藏
      editDataDialog: false,
      // 修改的参数数据
      editDataInfo: {
      },
      // 修改表单的验证信息
      editDataRules: {
        attr_name: [
          { required: true, message: '请输入要修改的参数', trigger: 'blur' }
        ]
      }
      // 新增参数tab标签---防止每行属性共用文本输入框显示和隐藏及输入数值
      // inputVisible: false,
      // inputValue: ''
    }
  },
  methods: {
    /*
    * 发起请求获取参数和属性的方法，不应该写在级联选择器中，会有限制，当切换tab栏时应该也会再次发起请求获取数据
    * */
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类数据获取失败')
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 级联选择框触动变化触发的函数 -- 发起请求，获取动态参数或者静态属性
    handleChange() {
      // console.log(this.selectedKeys)
      // 只能选中三级分类，如果选中的不是三级分类则清空数组
      // if (this.selectedKeys.length !== 3) {
      //   this.selectedKeys = []
      //   return true
      // }
      // // 没有return证明是选择了三级分类，如果不是三级分类则直接return出去了，不往下进行程序了
      // // 发请求，获取列表数据
      // const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeParamsName } })
      // if (res.meta.status !== 200) {
      //   return this.$message.error(res.meta.msg)
      // }
      // console.log(res)
      this.getParamsData()
    },
    // tab属性标签页
    handleClick() {
      console.log(this.activeParamsName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        // 如果选择的不是三级分类的话清空表单的动态参数和静态属性
        this.manyTabData = []
        this.onlyTabData = []
        return true
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeParamsName } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 判断数据是哪个表格中的数据，处理一下之后在保存
      // 获取attr_vals数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制每行属性文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的输入值
        item.inputValue = ''
      })
      // console.log(res.data)
      if (this.activeParamsName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    // 关闭添加属性对话框
    addDataDialogClose() {
      this.$refs.addDataDialogRef.resetFields()
    },
    // 添加属性-------添加属性和修改属性都会进行表单的验证和接口的请求，进行重新保存数据，可以将事件统一写在一个函数中，进行调用
    addData() {
      this.changeData()
      // 进行表单的预校验
      // this.$refs.addDataDialogRef.validate(async valid => {
      //   if (!valid) return
      //   // 验证信息成功，发起请求，添加动态参数或者静态属性
      //   const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addDataInfo.attr_name, attr_sel: this.activeParamsName })
      //   // console.log(res)
      //   if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      //   this.$message.success(res.meta.msg)
      //   this.addDataDialog = false
      //   this.getParamsData()
      // })
    },
    // 修改对话框的显示，获取当前参数的名称-----根据id查询到当前的参数，
    async edit(id) {
      // 查询当前这个参数的名称--请求接口
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
        { params: { attr_sel: this.activeParamsName } })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDataInfo = res.data
      this.editDataDialog = true
    },
    // 修改属性对话框关闭
    editDataDialogClose() {
      this.$refs.editDataDialogRef.resetFields()
    },
    // 修改属性确定----点击修改弹框时就已经获取到了当前数据的所有信息this.editDataInfo
    async editData() {
      // console.log(this.editDataInfo)
      // 一，校验，二，成功校验后请求
      this.$refs.editDataDialogRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editDataInfo.attr_id}`,
          { attr_name: this.editDataInfo.attr_name, attr_sel: this.activeParamsName })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // console.log(res)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDataDialog = false
      })
    },
    // 封装添加和修改属性的方法
    changeData() {
      this.$refs.addDataDialogRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addDataInfo.attr_name, attr_sel: this.activeParamsName })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDataDialog = false
        this.getParamsData()
      })
    },
    // 删除属性
    async delData(id) {
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户取消了操作
      if (confirmResult !== 'confirm') return this.$message.info('已取消')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getParamsData()
      this.$message.success(res.meta.msg)
    },
    // 删除属性标签
    handleClose(tag, row) {
      // console.log(row)
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1)
      this.saveTabVals(row)
    },
    // 添加tab标签显示文本框
    showInput(row) {
      row.inputVisible = true
      /*
      * 文本框显示之后立即获取焦点，
      * $nextTick方法是当页面上的元素被重新渲染之后，才会执行回调中的方法
      * 如果不用$nextTick，点击添加按钮，boolean为true，但是文本输入框元素不一定会渲染出来，此时获取文本输入框则就会报错
      * 所以就等待一个时机，等页面上的元素都渲染完成之后在获取文本框，调用focus方法
      * 获取当前的文本框this.$refs.saveTagInput.$refs.input，然后.focus()
      */
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存输入的属性tab标签
    async handleInputConfirm(vals) {
      // console.log(vals)
      let inputValue = vals.inputValue.trim()
      if (inputValue.trim().length > 0) {
        vals.attr_vals.push(inputValue)
        this.saveTabVals(vals)
      }
      vals.inputVisible = false
      vals.inputValue = ''
      // 如果用户没有输入
      // if (inputValue.trim().length === 0) {
      //   vals.inputVisible = false
      //   vals.inputValue = ''
      //   return false
      // }
    },
    // 保存属性的请求方法
    async saveTabVals(row) {
      // 发起请求，----应该在数据不为空的时候发起请求---提交到数据库中永久的保存数据
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,
        { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getParamsData()
      this.$message.success(res.meta.msg)
    }
  },
  created() {
    this.getCateList()
  },
  // 计算属性，
  computed: {
    // 按钮是否禁用的状态判断
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 选中参数的id，接口参数，获取参数的数据
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 添加动态参数和静态属性的计算属性的名称
    titleText() {
      if (this.activeParamsName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped>
.cat_opt{
  margin:15px 0;
}
.el-tag{
  margin-right: 10px;
}
  .input-new-tag{
    width:120px ;
  }
</style>
