//分类相关的数据ts类型

//共有类型
export interface responseData {
  code: number,
  message: string,
  ok: boolean
}

//分类ts类型
export interface CategoryObj {
  id: number | string,
  name: string,
  category1Id?: number,
  category2Id?: number
}

//响应的分类接口返回数据的类型
export interface CategoryResponseData extends responseData {
  data: CategoryObj[]
}