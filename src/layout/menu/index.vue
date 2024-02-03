<script lang="ts">
export default {
  name: 'Menu'
}
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps(['menuList'])

const router = useRouter()
const goRoute = (vc: any) => {
  router.push(vc.index)
}
</script>


<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 1.路由没有children -->
    <div v-if="!item.children">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </div>
    <!-- 2.路由只有一个child -->
    <div v-if="item.children && item.children.length === 1">
      <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </div>
    <!-- 3.路由的children大于1 -->
    <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 这里采用递归 -->
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped></style>