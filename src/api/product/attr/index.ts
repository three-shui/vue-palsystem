import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'

//一级分类
export const reqC1 = () => request.get<any, CategoryResponseData>('/admin/product/getCategory1')

//二级分类
export const reqC2 = (category1Id: string | number) => request.get<any, CategoryResponseData>('/admin/product/getCategory2/' + category1Id)

//三级分类
export const reqC3 = (category2Id: string | number) => request.get<any, CategoryResponseData>('/admin/product/getCategory3/' + category2Id)

//获取已有属性与属性值
export const reqCategory = (category1Id: string | number, category2Id: string | number, category3Id: string | number) =>
  request.get<any, AttrResponseData>('/admin/product/attrInfoList/' + `${category1Id}/${category2Id}/${category3Id}`)

//属性值新增或修改
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>('/admin/product/saveAttrInfo', data)

//删除属性值
export const reqDeleteAttr = (attrId: number) => request.delete<any, any>('/admin/product/deleteAttr/' + attrId)