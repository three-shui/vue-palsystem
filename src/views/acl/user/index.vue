<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user'
import type { UserResponseData, Records, User, AllRole, AllRoleResponseData, SetRoleData } from '@/api/acl/user/type';
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'
import { useSettingStore } from '@/stores/setting'

//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(5);
//用户总个数
let total = ref<number>(0);
//存储全部用户的数组
let userArr = ref<Records>([]);
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false);
let drawer1 = ref<boolean>(false);
//收集form对象 
const formRef = ref()
//分配角色相关属性
const checkAll = ref(false)
const isIndeterminate = ref(true)
//存储全部职位的数据
const allRole = ref<AllRole>([])
//当前用户已有的职位
const userRole = ref<AllRole>([])
//搜索关键字
const keyWord = ref<string>('')
//收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
});

//获取全部已有的用户信息
const getUser = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager;
  let res: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyWord.value);
  if (res.code === 200) {
    total.value = res.data.total;
    userArr.value = res.data.records;
  }
}

//组件挂载完毕
onMounted(() => {
  getUser();
});

//分页器下拉菜单的自定义事件的回调
const handler = () => {
  getUser();
}

//添加用户按钮的回调
const addUser = () => {
  //抽屉显示出来
  drawer.value = true;
  //清空上次输入的数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  //清理所有字段的表单验证信息。
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('password')
  })
}

//更新已有的用户按钮的回调
const updateUser = (row: User) => {
  //抽屉显示出来
  drawer.value = true;
  Object.assign(userParams, row)
  //清理所有字段的表单验证信息。
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('username')
  })
}

//抽屉的确认按钮回调
const save = async () => {
  //先对整个表单进行校验
  await formRef.value.validate()
  const res = await reqAddOrUpdateUser(userParams)
  console.log(res)
  if (res.code === 200) {
    //关闭抽屉
    drawer.value = false;
    ElMessage.success(userParams.id ? '修改成功' : '添加成功')
    //再次获取用户信息(因为下面又使用了页面刷新,所以这里可以不用获取用户信息了)
    // getUser()
    //让页面重新刷新（防止修改自己账号而显示错误）
    window.location.reload()
  } else {
    //关闭抽屉
    drawer.value = false;
    ElMessage.error(userParams.id ? '修改失败' : '添加失败')
  }
}

//分配角色
const setRole = async (row: User) => {
  //修改全选按钮的选中状态
  isIndeterminate.value = row.roleName ? true : false
  //存储已有的用户信息
  Object.assign(userParams, row);
  const res: AllRoleResponseData = await reqAllRole((row.id as number))
  if (res.code === 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
    drawer1.value = true
  }
}

const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

//分配角色确认按钮回调
const confirmClick = async () => {
  //收集数据
  const data: SetRoleData = {
    userId: (userParams.id as number),
    roleIdList: userRole.value.map(item => (item.id as number))
  }
  const result: any = await reqSetUserRole(data);
  if (result.code === 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' });
    //关闭抽屉
    drawer1.value = false;
    //获取更新完毕用户的信息,更新完毕留在当前页
    getUser(pageNo.value);
  }
}

//删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
}

const delArr = ref<User[]>([])
//table复选框勾选的时候会触发的事件
const selectChange = async (value: any) => {
  delArr.value = value
}
//批量删除
const deleteSelectUser = async () => {
  //整理批量删除的参数
  const idList: any = delArr.value.map(item => item.id)
  const res: any = await reqSelectUser(idList)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
}

//搜索按钮回调
const search = () => {
  getUser()
}
//重置
const settingStore = useSettingStore()
const refresh = () => {
  settingStore.refresh = !settingStore.refresh
}

//表单校验规则
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 8) {
    callback()
  } else {
    callback(new Error('用户名必须大于8位'))
  }
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 8) {
    callback()
  } else {
    callback(new Error('姓名必须大于8位'))
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('密码必须大于等于6位'))
  }
}
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }]
}
</script>

<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyWord ? false : true" @click="search">搜索</el-button>
        <el-button size="default" @click="refresh">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button type="primary" size="default" @click="deleteSelectUser"
      :disabled="delArr.length ? false : true">批量删除</el-button>
    <!-- table展示用户信息 -->
    <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data="userArr">
      <el-table-column type="selection" align="center" />
      <el-table-column label="#" align="center" type="index" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip />
      <el-table-column label="用户昵称" align="center" prop="username" show-overflow-tooltip />
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip />
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip />
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip />
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="success" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getUser"
      @size-change="handler" />
    <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
    <el-drawer v-model="drawer">
      <!-- 头部标题:将来文字内容应该动态的 -->
      <template #header>
        <h4>{{ userParams.id ? '修改用户' : '添加用户' }}</h4>
      </template>
      <!-- 身体部分 -->
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户名称" prop="name">
            <el-input placeholder="请您输入用户姓名" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="username">
            <el-input placeholder="请您输入用户昵称" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div>
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构:完成分配权限 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input :disabled="true" v-model="userParams.username" />
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
              @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>