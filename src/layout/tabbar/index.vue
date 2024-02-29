<script setup lang="ts">
import { ref } from 'vue'
import { useSettingStore } from '@/stores/setting'
import { useRoute, useRouter } from 'vue-router'
import { useUserSrote } from '@/stores/modules/user';

const userSrote = useUserSrote()

const route = useRoute()
const router = useRouter()

const settingStore = useSettingStore()
//折叠
const changeIcon = () => {
  settingStore.fold = !settingStore.fold
}

//刷新
const refresh = () => {
  settingStore.refresh = !settingStore.refresh
}

//全屏(利用原生dom就能实现)
const fullScreen = () => {
  //DOM对象的一个属性，返回一个bool，可以用来判断当前是不是全屏模式
  const full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

//退出登录
const logout = async () => {
  //1.向后端发请求，告诉后端这个token不用了
  //2.清空仓库数据
  await userSrote.logout()
  //3.跳转到登录页面
  router.push({ path: '/login', query: { redirect: route.path } })
}

//颜色选择器
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

//切换主题颜色回调
const setColor = () => {
  //获取html的根节点
  const el = document.documentElement
  // 设置 css 变量
  el.style.setProperty('--el-color-primary', color.value)
}

//暗黑模式
const dark = ref(false)
//切换暗黑模式
const changeDark = () => {
  //获取html的根节点
  const html = document.documentElement
  //判断html标签是否有类名dark
  dark.value ? html.className = 'dark' : html.className = ''
}
</script>

<template>
  <div class="tabbar">
    <!-- 左侧 -->
    <div class="tabbar_left">
      <el-icon class="icon" @click="changeIcon">
        <!-- component通过属性is的值可以渲染不同的组件 -->
        <component :is="settingStore.fold?'Fold':'Expand'"></component>
        <!-- <Expand /> -->
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <!-- 这里只能用v-show，不能用v-if，因为在vue3中v-if比v-for的优先级更高 -->
        <el-breadcrumb-item v-for="item in route.matched" :key="item.path" v-show="item.meta.title" :to="item.path">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧 -->
    <div class="tabbar_right">
      <el-button icon="Refresh" circle @click="refresh" />
      <el-button icon="FullScreen" circle @click="fullScreen" />
      <el-popover placement="bottom" title="主题设置" :width="250" trigger="hover">
        <el-form>
          <el-form-item label="主题颜色">
            <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors"
              :teleported="false" />
          </el-form-item>
          <el-form-item label="暗黑模式">
            <el-switch v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" @change="changeDark" />
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button icon="Setting" circle />
        </template>
      </el-popover>
      <img :src="userSrote.avatar" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userSrote.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 15px 0 20px;
  background-image: linear-gradient(to right, rgb(189, 245, 178), rgb(67, 240, 28), rgb(148, 225, 140));

  .tabbar_left {
    display: flex;
    align-items: center;

    .icon {
      margin-right: 7px;
    }
  }

  .tabbar_right {
    display: flex;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin: 0 10px;
      border-radius: 50%;
    }
  }
}
</style>