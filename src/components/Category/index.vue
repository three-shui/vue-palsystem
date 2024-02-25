<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/modules/category'

const categoryStore = useCategoryStore()

onMounted(() => { categoryStore.getC1() })

//一级分类变化时的回调函数
const handle1 = () => {
  //一级分类变化时需要清空二级分类和三级分类
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //再查询二级分类内容
  categoryStore.getC2()
}

//二级分类变化时的回调函数
const handle2 = () => {
  //二级分类变化时需要清空三级分类id
  categoryStore.c3Id = ''
  //再查询三级分类内容
  categoryStore.getC3()
}

defineProps(['scene'])
</script>

<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <!-- v-model 的值为当前被选中的 el-option 的 value 属性值 -->
          <el-select :disabled="scene === 0 ? false : true" style="width: 200px" v-model="categoryStore.c1Id"
            @change="handle1">
            <!-- label:即为展示数据   value:即为select下拉菜单收集的数据 -->
            <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select :disabled="scene === 0 ? false : true" style="width: 200px" v-model="categoryStore.c2Id"
            @change="handle2">
            <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select :disabled="scene === 0 ? false : true" style="width: 200px" v-model="categoryStore.c3Id">
            <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>