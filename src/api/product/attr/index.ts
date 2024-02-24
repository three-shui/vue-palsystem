import request from '@/utils/request'
import type { CategoryResponseData } from './type'

//一级分类
export const reqC1 = () => request.get<any, CategoryResponseData>('/admin/product/getCategory1')

//二级分类
export const reqC2 = (category1Id: string | number) => request.get<any, CategoryResponseData>('/admin/product/getCategory2/' + category1Id)

//三级分类
export const reqC3 = (category2Id: string | number) => request.get<any, CategoryResponseData>('/admin/product/getCategory3/' + category2Id)