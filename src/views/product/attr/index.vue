<script setup lang="ts">
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
import Category from '@/components/Category/index.vue'
import { reqCategory, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { useCategoryStore } from '@/stores/modules/category'
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'

const categoryStore = useCategoryStore()

//定义一个数据用来进行切换是否禁用
const scene = ref(0)

//收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: '', //新增属性名称
  categoryId: '', //所属的三级分类id
  categoryLevel: 3, //代表的是三级分类
  attrValueList: [] //新增的属性值数据
})

//存储已有的属性与属性值
const attrArr = ref<Attr[]>([])

//准备一个数组，将来存储对应的组件实例el-input
const inputArr = ref<any>([])

const toEdit = (row: AttrValue, $index: number) => {
  //切换
  row.flag = true
  //响应式数据发生变化，获取更新的DOM（组件实例）
  nextTick(() => {
    //获取焦点
    inputArr.value[$index].focus()
  })
}

//监听仓库三级分类id变化
watch(() => categoryStore.c3Id, async () => {
  //清空上一次查询的属性与属性值
  attrArr.value = []
  //如果没有三级分类id，直接返回不发请求
  if (!categoryStore.c3Id) return
  //最后再发请求查询
  getCategory()
})

//查询
const getCategory = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const res: AttrResponseData = await reqCategory(c1Id, c2Id, c3Id)
  if (res.code === 200) {
    attrArr.value = res.data
  }
}

//添加平台属性
const addAttr = () => {
  //先清空以前添加的数据
  Object.assign(attrParams, {
    attrName: '', //新增属性名称
    categoryId: categoryStore.c3Id, //所属的三级分类id(这里直接收集)
    categoryLevel: 3, //代表的是三级分类
    attrValueList: [] //新增的属性值数据
  })
  //切换
  scene.value = 1
}

//添加属性值回调
const addAttrValue = () => {
  //添加数据
  attrParams.attrValueList.push({
    valueName: '',
    flag: true //控制每个属性值的编辑模式与切换模式的切换
  })
  //让最后一个el-input获取焦点
  nextTick(() => {
    //获取焦点
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存
const save = async () => {
  const res = await reqAddOrUpdateAttr(attrParams)
  if (res.code === 200) {
    //切换场景
    scene.value = 0
    ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
    //重新获取数据
    getCategory()
  } else {
    ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
  }
}

//添加属性值时失焦
const blur = (row: AttrValue, $index: number) => {
  //1.先判断不能为空
  if (row.valueName.trim() === '') {
    ElMessage.error('属性值不能为空')
    //如果为空直接删除
    attrParams.attrValueList.splice($index, 1)
    return
  }

  //2.判断属性值不能重复
  const repeat = attrParams.attrValueList.find((item) => {
    //这里使用find方法进行查找，所以需要先把row本身给去除掉
    if (row !== item) {
      return row.valueName === item.valueName
    }
  })
  //如果重复直接删除重复的数据
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能重复')
    return
  }

  //切换
  row.flag = false
}

//编辑按钮回调
const editAttr = (row: Attr) => {
  //切换
  scene.value = 1
  //回显(这里要注意：Object.assign为浅拷贝，可能会造成小bug，需要使用json序列化转化为深拷贝)
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

//删除按钮回调
const deleteAttr = async (attrId: number) => {
  const res = await reqDeleteAttr(attrId)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getCategory()
  } else {
    ElMessage.error('删除失败')
  }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空分类仓库的数据(因为这里使用的组合式API的写法，所以不能直接使用$reset()方法)
  categoryStore.c1Arr = []
  categoryStore.c1Id = ''
  categoryStore.c2Arr = []
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
})
</script>

<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
      <div v-show="scene === 0">
        <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr">添加平台属性</el-button>
        <el-table border style="margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" align="center" width="80px" type="index" />
          <el-table-column label="属性名称" width="120px" prop="attrName" />
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag style="margin: 5px;" v-for="tag in row.attrValueList" :key="tag.id">{{ tag.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template #="{ row }">
              <el-button type="success" size="small" icon="Edit" @click="editAttr(row)" />
              <el-popconfirm :title="`你确认要删除${row.attrName}吗?`" @confirm="deleteAttr(row.id)" width=200px>
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName" />
          </el-form-item>
        </el-form>
        <el-button :disabled="attrParams.attrName ? false : true" type="primary" icon="Plus"
          @click="addAttrValue">添加属性值</el-button>
        <el-button @click="scene = 0">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" align="center" width="80px" type="index" />
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <!-- vc为组件实例 -->
              <el-input :ref="(vc: any) => inputArr[$index] = vc" @blur="blur(row, $index)" placeholder="请输入属性值名称"
                v-model="row.valueName" v-if="row.flag === true"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="danger" size="small" icon="Delete" @click="attrParams.attrValueList.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
        <el-button :disabled="attrParams.attrValueList.length > 0 ? false : true" type="primary"
          @click="save">保存</el-button>
        <el-button @click="scene = 0">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>