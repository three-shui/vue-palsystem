import request from "@/utils/request";
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from "./type";


//获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>('/admin/acl/user/' + `${page}/${limit}?username=${username}`);

//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data: User) => {
  //携带参数有ID更新
  if (data.id) {
    return request.put<any, any>('/admin/acl/user/update', data);
  } else {
    return request.post<any, any>("/admin/acl/user/save", data);
  }
}

//获取全部职位以及包含当前用户的已有的职位
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>('/admin/acl/user/toAssign/' + userId);
//分配职位
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>('/admin/acl/user/doAssignRole', data);

//删除某一个账号的信息
export const reqRemoveUser = (userId: number) => request.delete<any, any>('/admin/acl/user/remove/' + userId);
//批量删除的接口
export const reqSelectUser = (idList: number[]) => request.delete('/admin/acl/user/batchRemove', { data: idList });