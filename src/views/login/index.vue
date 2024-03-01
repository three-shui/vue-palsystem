<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useUserSrote } from '@/stores/modules/user'
import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/el-notification.css'
import { useRouter, useRoute } from 'vue-router'
import { getTime } from '@/utils/time'

const route = useRoute()
const router = useRouter()

//用户名和密码
const loginForm = reactive({ username: 'admin', password: '111111' })

//登录时的加载效果
const loading = ref(false)

//2.自定义密码校验
const validatePassword = (rule: any, value: any, callback: any) => {
  //rule:即为校验规则对象
  //value:即为表单元素文本内容
  //函数：如果符合条件callback放行通过，否则注入错误提示信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码必须大于6位'))
  }
}
//2.1校验规则
const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'change' },
    { min: 4, max: 16, message: '用户名必须为4-16位', trigger: 'change' },
  ],
  //这里密码使用自定义校验规则
  password: [{ validator: validatePassword, trigger: 'change' }]
})
//2.2点击登录按钮需要对整个表单的内容进行验证,这里获取表单的dom节点
const loginForms = ref()


//1.登录
const userSrote = useUserSrote()
const login = async () => {
  //1.3.发请求之前先对整个表单的内容进行验证
  //这里的validate返回一个Promise对象，如果失败则不会发请求
  await loginForms.value.validate()
  loading.value = true
  try {
    //1.1.登录成功
    await userSrote.userLogin(loginForm)
    ElNotification({
      title: `Hi,${getTime()}好`,
      message: '登录成功',
      type: 'success',
    })
    //关闭loading加载效果
    loading.value = false
    //跳转(如果路径中有redirect参数，则跳转到redirect参数，否则跳转到首页)
    const redirect: any = route.query.redirect
    router.push({ path: redirect || '/' })
    //TODO
    //页面刷新(这里防止异步路由加载权限出现问题，暂时先这么做) 
    window.location.reload();
  } catch (error) {
    //1.2.登录失败
    ElNotification.error((error as Error).message)
    //关闭loading加载效果
    loading.value = false
  }
}

</script>

<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>welcome to the Palworld</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon='Lock' show-password v-model="loginForm.password" />
            <!-- <el-input type="password" :prefix-icon="Lock" /> -->
          </el-form-item>
          <el-form-item>
            <el-button class="login_btn" type="primary" @click="login" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>