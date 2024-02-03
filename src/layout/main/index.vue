<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import { useSettingStore } from '@/stores/setting'

const settingStore = useSettingStore()

//控制当前组件是否重建销毁
const flag = ref(true)
//点击刷新按钮，路由组件销毁
watch(() => settingStore.refresh, () => {
  flag.value = false
  //nextTick：当dom更新完，立即执行方法体
  nextTick(() => {
    flag.value = true
  })
})
</script>

<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <!-- v-if可以控制组件重建与销毁 -->
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>