//商品分类全局组件的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData, CategoryObj } from '@/api/product/attr/type'

export const useCategoryStore = defineStore('categoryStore', () => {

  //存储一级分类数据
  const c1Arr = ref<CategoryObj[]>([])
  //存储一级分类id
  const c1Id = ref<string | number>('')
  //存储二级分类数据
  const c2Arr = ref<CategoryObj[]>([])
  //存储二级分类id
  const c2Id = ref<string | number>('')
  //存储三级分类数据
  const c3Arr = ref<CategoryObj[]>([])
  //存储三级分类id
  const c3Id = ref<string | number>('')

  //获取一级分类数据
  const getC1 = async () => {
    const res: CategoryResponseData = await reqC1()
    if (res.code === 200) {
      c1Arr.value = res.data
    }
  }

  //获取二级分类数据
  const getC2 = async () => {
    const res: CategoryResponseData = await reqC2(c1Id.value)
    if (res.code === 200) {
      c2Arr.value = res.data
    }
  }

  //获取三级分类数据
  const getC3 = async () => {
    const res: CategoryResponseData = await reqC3(c2Id.value)
    if (res.code === 200) {
      c3Arr.value = res.data
    }
  }

  return { c1Arr, c1Id, getC1, c2Arr, c2Id, getC2, c3Arr, c3Id, getC3 }

})