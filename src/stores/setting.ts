//layout组件相关配置仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('settingStore', () => {
  //折叠
  const fold = ref(false)
  //刷新
  const refresh = ref(false)

  return { fold, refresh }
})