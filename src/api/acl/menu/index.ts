import request from "@/utils/request";
import type { PermisstionResponseData, MenuParams } from './type';

//获取菜单数据
export const reqAllPermisstion = () => request.get<any, PermisstionResponseData>('/admin/acl/permission');
//添加与更新菜单的方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>('/admin/acl/permission/update', data);
  } else {
    return request.post<any, any>('/admin/acl/permission/save', data);
  }
}

//删除某一个已有的菜单
export const reqRemoveMenu = (id: number) => request.delete<any, any>('/admin/acl/permission/remove/' + id);