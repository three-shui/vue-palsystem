import request from '@/utils/request'
import type { TradeMarkResponseData } from './type'

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>('/admin/product/baseTrademark/' + `${page}/${limit}`)
