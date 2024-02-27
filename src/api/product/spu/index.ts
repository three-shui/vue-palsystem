import request from '@/utils/request'
import type { SkuInfoData, SkuData, SpuResponseData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, SpuData } from './type'

//查询SPU
export const reqSpu = (page: number, limit: number, category3Id: number | string) =>
  request.get<any, SpuResponseData>('/admin/product/' + `${page}/${limit}?category3Id=${category3Id}`)

//获取全部的SPU的品牌的数据
export const reqAllTradeMark = () => request.get<any, AllTradeMark>('/admin/product/baseTrademark/getTrademarkList');

//获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spuId: number) => request.get<any, SpuHasImg>('/admin/product/spuImageList/' + spuId)

//获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>('/admin/product/spuSaleAttrList/' + spuId)

//获取全部的销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>('/admin/product/baseSaleAttrList');

//添加|更新已有的SPU接口
//data:即为新增的SPU|或者已有的SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  //如果SPU对象拥有ID,更新已有的SPU
  if (data.id) {
    return request.post<any, any>('/admin/product/updateSpuInfo', data)
  } else {
    return request.post<any, any>('/admin/product/saveSpuInfo', data);
  }
}

//添加SKU的请求方法
export const reqAddSku = (data: SkuData) => request.post<any, any>('/admin/product/saveSkuInfo', data);

//获取SKU数据
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>('/admin/product/findBySpuId/' + spuId);

//删除已有的SPU
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>('/admin/product/deleteSpu/' + spuId);