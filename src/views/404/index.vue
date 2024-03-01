<script setup lang="ts">

</script>

<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" />
    <button @click="$router.push('/home')">点我去首页</button>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  background: yellowgreen;
  display: flex;
  justify-content: center;

  img {
    width: 800px;
    height: 400px;
  }

  button {
    width: 100px;
    height: 50px;
  }
}
</style>