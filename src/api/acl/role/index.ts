import request from "@/utils/request";
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

//获取全部的角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>('/admin/acl/role/' + `${page}/${limit}/?roleName=${roleName}`);
//添加职位与更新已有职位接口
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>('/admin/acl/role/update', data);
  } else {
    return request.post<any, any>('/admin/acl/role/save', data);
  }
}

//获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>("/admin/acl/permission/toAssign/" + roleId);
//给相应的职位下发权限
export const reqSetPermisstion = (roleId: number, permissionId: number[]) => request.post('/admin/acl/permission/doAssign/?' + `roleId=${roleId}&permissionId=${permissionId}`);
//删除已有的职位
export const reqRemoveRole = (roleId: number) => request.delete<any, any>('/admin/acl/role/remove/' + roleId)