<script setup lang="ts">
import Category from '@/components/Category/index.vue'
import { useCategoryStore } from '@/stores/modules/category'

const categoryStore = useCategoryStore()
</script>

<template>
  <div>
    <Category />
    <el-card style="margin: 10px 0;">
      <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true">添加平台属性</el-button>
      <el-table border style="margin: 10px 0;">
        <el-table-column label="序号" align="center" width="80px" />
        <el-table-column label="属性名称" width="120px" />
        <el-table-column label="属性值名称" />
        <el-table-column label="操作" width="120px" />
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>