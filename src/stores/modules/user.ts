import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'
//引入静态路由文件
import { constantRoute } from '@/router/routes'


export const useUserSrote = defineStore('user', () => {
  //保存静态路由到pinia，这里必须加ref
  const routeList = ref(constantRoute)

  const token = ref('')
  const username = ref('')
  const avatar = ref('')
  //登录
  const userLogin = async (data: loginFormData) => {
    const res: loginResponseData = await reqLogin(data)
    if (res.code === 200) { //登录成功
      token.value = res.data
      return 'ok'
    } else { //登录失败
      return Promise.reject(new Error(res.data))
    }
  }

  //获取用户信息
  const getUserInfo = async () => {
    const res: userInfoResponseData = await reqUserInfo()
    if (res.code === 200) {
      username.value = res.data.name
      avatar.value = res.data.avatar
      return 'ok'
    } else { //token失效，获取用户信息失败
      return Promise.reject(new Error(res.message))
    }
  }

  //退出登录
  const logout = async () => {
    const res: any = await reqLogout()
    if (res.code === 200) {
      token.value = ''
      username.value = ''
      avatar.value = ''
      return 'ok'
    } else { //退出登录失败
      return Promise.reject(new Error(res.message))
    }
  }

  return { token, userLogin, routeList, getUserInfo, username, avatar, logout }
},
  //持久化
  {
    persist: true,
  }
)