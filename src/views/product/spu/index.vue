<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import Category from '@/components/Category/index.vue'
import { useCategoryStore } from '@/stores/modules/category'
import { reqSpu, reqRemoveSpu } from '@/api/product/spu'
import type { SkuData, SpuData, Records, SpuResponseData, SkuInfoData } from '@/api/product/spu/type'
import { reqSkuList } from '@/api/product/spu';
import SkuForm from './SkuForm.vue'
import SpuForm from './SpuForm.vue'
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'

const categoryStore = useCategoryStore()

//获取子组件的vc实例
const spu = ref()
const sku = ref()

//定义一个数据用来进行切换是否禁用(以及场景切换)
//0：展示spu  1：新增|修改spu  2：新增sku
const scene = ref(0)

//存储已有的SPU的数据
let records = ref<Records>([]);

//分页器相关数据
const pageNo = ref(1)
const pageSize = ref(3)
const total = ref(0)

//存储全部的SKU数据
let skuArr = ref<SkuData[]>([]);
//控制对话框显示与隐藏
let show = ref<boolean>(false);

//监视三级分类的变化
watch(() => categoryStore.c3Id, () => {
  //当三级分类发生变化的时候清空对应的数据
  records.value = [];
  //务必保证有三级分类ID
  if (!categoryStore.c3Id) return;
  getSpu()
})

const getSpu = async (pager = 1) => {
  //默认是第一页
  pageNo.value = pager
  const res: SpuResponseData = await reqSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (res.code === 200) {
    records.value = res.data.records;
    total.value = res.data.total
  }
}

const sizeChange = () => {
  getSpu()
}

//子传父
//这里接受子组件传递过来的数据，用来进行场景切换
const changeScene = (obj: any) => {
  //子组件Spuform点击取消变为场景0:展示已有的SPU
  scene.value = obj.flag;
  if (obj.params === 'update') {
    //更新留在当前页
    getSpu(pageNo.value);
  } else {
    //添加留在第一页
    getSpu();
  }
}

//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1:添加与修改已有SPU结构->SpuForm
  scene.value = 1;
  //点击添加SPU按钮,调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id);
}

//修改SPU
const updateSpu = (row: SpuData) => {
  scene.value = 1
  //在父组件中调用子组件的方法
  spu.value.initHasSpuData(row)
}

//添加sku
const addSku = (row: SpuData) => {
  //点击添加SKU按钮切换场景为2
  scene.value = 2;
  ////调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//查看sku列表
const findSku = async (row: SpuData) => {
  const res: SkuInfoData = await reqSkuList((row.id as number))
  if (res.code === 200) {
    skuArr.value = res.data;
    //对话框显示出来
    show.value = true;
  }
}

//删除spu
const deleteSpu = async (row: any) => {
  const res = await reqRemoveSpu(row.id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    //获取剩余SPU数据
    getSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
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
    <el-card style="margin:10px 0">
      <div v-show="scene === 0">
        <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu">添加SPU</el-button>
        <el-table border style="margin:10px 0" :data="records">
          <el-table-column label="序号" width="80px" align="center" type="index" />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column label="SPU描述" prop="description" />
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)" />
              <el-button type="warning" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)" />
              <el-button type="info" size="small" icon="View" title="查看SKU列表" @click="findSku(row)" />
              <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" title="删除SPU" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getSpu"
          @size-change="sizeChange" />
      </div>
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene" />
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene" />
      <!-- dialog对话框:展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>