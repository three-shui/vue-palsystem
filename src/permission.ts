//路由鉴权
import router from '@/router'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false });

import { useUserSrote } from './stores/modules/user'

//路由前置守卫
//to:你将要访问那个路由
//from:你从哪个路由而来
//next:路由的放行函数
router.beforeEach(async (to, from, next) => {
  document.title = '幻兽帕鲁-' + to.meta.title
  const userSrote = useUserSrote()
  const token = userSrote.token
  let username = userSrote.username

  //如果已经登录
  if (token) {
    if (to.path === '/login') { //登录之后还想访问login，就跳转到首页
      next('/')
    } else {
      //这里每次切换路由都把username设为空，保证每次都要发请求获取用户信息，可防止token失效
      username = ''
      //登录成功之后访问其余页面，判断是否有用户信息，没有就获取
      if (username) {
        next()
      } else {
        try {
          await userSrote.getUserInfo()
          next()
        } catch (error) { //获取用户信息失败(这种情况是指token失效)
          //清除用户信息并跳转到首页
          await userSrote.logout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else { //未登录
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }

  //进度条开始
  nprogress.start();
})

//路由后置守卫
router.afterEach((to, from) => {
  //进度条结束
  nprogress.done();
})