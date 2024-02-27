import request from "@/utils/request";
import type { SkuResponseData, SkuInfoData } from './type'

//获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>('/admin/product/list/' + `${page}/${limit}`)

//已有商品上架的请求
export const reqSaleSku = (skuId: number) => request.get<any, any>('/admin/product/onSale/' + skuId);
//下架的请求
export const reqCancelSale = (skuId: number) => request.get<any, any>('/admin/product/cancelSale/' + skuId);

//获取商品详情的接口
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>('/admin/product/getSkuInfo/' + skuId);
//删除某一个已有的商品
export const reqRemoveSku = (skuId: number) => request.delete<any, any>('/admin/product/deleteSku/' + skuId)
