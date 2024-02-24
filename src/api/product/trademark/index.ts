import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>('/admin/product/baseTrademark/' + `${page}/${limit}`)

//新增与修改
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  //有id，就是修改
  if (data.id) {
    return request.put<any, any>('/admin/product/baseTrademark/update', data)
  } else { //无id，为新增
    return request.post<any, any>('/admin/product/baseTrademark/save', data)
  }
}

//删除
export const reqRemoveTrademark = (id: number) => request.delete<any, any>('/admin/product/baseTrademark/remove/' + id)