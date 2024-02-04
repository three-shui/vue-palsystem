<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData } from '@/api/product/trademark/type'

//当前页码
const pageNo = ref<number>(1)
//每页显示条目个数
const pageSize = ref<number>(3)
//总数据量
const total = ref<number>(0)
//存储品牌数据内容
const trademarkList = ref<Records>([])

const getTrademark = async () => {
  const res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, pageSize.value)
  if (res.code === 200) {
    total.value = res.data.total
    trademarkList.value = res.data.records
  }
}

onMounted(() => getTrademark())
</script>

<template>
  <div>
    <el-card class="box-card">
      <!-- 顶部按钮 -->
      <el-button type="primary" icon="Plus">添加品牌</el-button>
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
            <el-button type="success" size="small" icon="Edit" />
            <el-button type="danger" size="small" icon="Delete" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页条 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="400" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>