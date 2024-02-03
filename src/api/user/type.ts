//登录携带参数类型
export interface loginFormData {
  username: string,
  password: string
}

//全部接口返回数据都拥有的ts类型
export interface responseData {
  code: number,
  message: string,
  ok: string
}

//登录接口返回数据类型
export interface loginResponseData extends responseData {
  data: string
}

//获取用户信息返回数据类型
export interface userInfoResponseData extends responseData {
  data: {
    routes: string[],
    buttons: string[],
    roles: string[],
    name: string,
    avatar: string
  }
}
