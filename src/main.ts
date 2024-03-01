import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import pinia from '@/stores'

import App from './App.vue'
import router from './router'
//引入模板的全局样式
import '@/style/index.scss'
//引入element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//鉴权
import './permission'
//引入ElementPlus，下面设置ElementPlus为中文
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
import { isHasButton } from '@/directive/has'


const app = createApp(App)
//element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
//设置ElementPlus为中文
app.use(ElementPlus, {
  locale: zhCn,
})

//判断是否拥有按钮权限
isHasButton(app)

app.mount('#app')