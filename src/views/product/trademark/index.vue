<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqRemoveTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'

const dialogFormVisible = ref<boolean>(false)

const trademarkParams = reactive<TradeMark>(
  {
    tmName: '',
    logoUrl: ''
  }
)

//当前页码
const pageNo = ref<number>(1)
//每页显示条目个数
const pageSize = ref<number>(3)
//总数据量
const total = ref<number>(0)
//存储品牌数据内容
const trademarkList = ref<Records>([])

//获取form组件实例
const formRef = ref()

//当不指定显示第几页时，默认显示第一页
//当切换每页显示数量时，也跳转到第一页
const getTrademark = async (pager = 1) => {
  pageNo.value = pager
  const res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, pageSize.value)
  if (res.code === 200) {
    total.value = res.data.total
    trademarkList.value = res.data.records
  }
}

onMounted(() => getTrademark())

//切换每页显示数量
const sizeChange = () => {
  getTrademark()
}

//添加品牌
const addTrademark = () => {
  //1.打开对话框
  dialogFormVisible.value = true
  //2.清空对话框以前内容
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  //清除校验规则(这里必须加问号，因为第一次打开dialog时，formRef还没有绑定，会报错)
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}

//修改品牌信息
//row即为当前已有的品牌信息
const updateTrademark = (row: TradeMark) => {
  //打开对话框
  dialogFormVisible.value = true
  //回显信息
  trademarkParams.id = row.id
  trademarkParams.logoUrl = row.logoUrl
  trademarkParams.tmName = row.tmName
  //上面三行也可以用ES6的合并对象语法
  // Object.assign(trademarkParams, row)

  //清除校验规则(这里必须加问号，因为第一次打开dialog时，formRef还没有绑定，会报错)
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}

//对话框确认按钮事件
const confirm = async () => {
  //校验表单信息
  await formRef.value.validate()
  //1.发请求
  const res = await reqAddOrUpdateTrademark(trademarkParams)
  if (res.code === 200) { //添加成功
    //弹出提示信息
    ElMessage.success(trademarkParams.id ? '修改品牌成功' : '添加品牌成功')
    //再次发请求获取全部数据(如果是修改，就留在当前页；如果是添加返回第一页)
    getTrademark(trademarkParams.id ? pageNo.value : 1)
  } else { //添加失败
    ElMessage.error(trademarkParams.id ? '修改品牌失败' : '添加品牌失败')
  }
  //2.关闭对话框
  dialogFormVisible.value = false
}

//对话框取消按钮事件
const cancle = () => {
  //关闭对话框
  dialogFormVisible.value = false
}

//图片上传成功触发的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //收集返回的url，添加的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功应清除校验规则
  formRef.value.clearValidate('logoUrl')
}

//上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 > 10) {
      ElMessage.error('图片大小不能超过10M!')
      return false
    }
    return true
  } else {
    ElMessage.error('图片格式只能是jpg或png或gif!')
    return false
  }
}

//dialog校验规则(自定义)
const validateTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称必须大于等于两位'))
  }
}

//自定义校验图片（这里的value为图片上传之后返回的地址）
const validateLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传图片'))
  }
}

const rules = {
  tmName: [{ required: true, validator: validateTmName, trigger: 'blur' }],
  logoUrl: [{ required: true, validator: validateLogoUrl }]
}

//删除trademark
const removeTrademark = async (id: number) => {
  const res = await reqRemoveTrademark(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    //再次获取已有品牌数据
    getTrademark(trademarkList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <!-- 顶部按钮 -->
      <el-button type="primary" icon="Plus" @click="addTrademark">添加品牌</el-button>
      <!-- 表格 -->
      <el-table style="margin:15px 0" border :data="trademarkList">
        <el-table-column label="序号" width="80px" align="center" type="index" />
        <el-table-column label="品牌名称" prop="tmName" />
        <el-table-column label="品牌logo">
          <!-- 这里使用column的插槽加载图片 -->
          <!-- row:表示这一行的对象信息 -->
          <template #="{ row }">
            <!-- 这里其实使用下面这一行就可以，但考虑到数据库的有些图片开头没有http，于是就用三元选择了一下 -->
            <!-- <img :src="row.logoUrl" style="{width:100px;height:100px;}" /> -->
            <img :src="row.logoUrl.substring(0, 7) == 'http://' ? `${row.logoUrl}` : `http://${row.logoUrl}`"
              style="{width:100px;height:100px;}" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button type="success" size="small" icon="Edit" @click="updateTrademark(row)" />
            <el-popconfirm :title="`你确认要删除${row.tmName}吗?`" width="200px" icon="Delete" icon-color="red"
              @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页条 -->
      <el-pagination @current-change="getTrademark" @size-change="sizeChange" v-model:current-page="pageNo"
        v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]" :background="true"
        layout="prev, pager, next, jumper,->,sizes,total" :total="total" />
    </el-card>

    <!-- 添加时的弹出对话框 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width:80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="http://sph-api.atguigu.cn/admin/product/fileUpload"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- footer -->
      <template #footer>
        <el-button @click="cancle">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>