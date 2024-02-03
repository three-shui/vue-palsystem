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

const app = createApp(App)
//element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')