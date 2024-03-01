//自定义指令，用来判断是否拥有按钮权限
import { useUserSrote } from '@/stores/modules/user';
import pinia from '@/stores'
// const userStore = useUserSrote(pinia)  //pinia持久化失败

export const isHasButton = (app: any) => {
  const userStore = useUserSrote(pinia)  //pinia持久化成功(这里必须在函数内部调用)
  //全局自定义指令:实现按钮的权限
  app.directive('has', {
    //el代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    //options可以拿到自定义指令等号右侧的值
    mounted(el: any, options: any) {
      //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
      //从DOM树上干掉
      if (!userStore.buttons.includes(options.value)) {
        // el.parentNode.removeChild(el);
        el.remove()
      }
    },
  })
}