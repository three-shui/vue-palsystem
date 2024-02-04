import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//引入模板的全局样式
import '@/style/index.scss'
//pinia持久化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//引入element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//鉴权
import './permission'
//引入ElementPlus，下面设置ElementPlus为中文
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'


const app = createApp(App)
//element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
//设置ElementPlus为中文
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')