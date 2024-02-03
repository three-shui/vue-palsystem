import axios from "axios";
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'
import { useUserSrote } from "@/stores/modules/user";

const request = axios.create({
  baseURL: 'http://sph-api.atguigu.cn',
  timeout: 5000
});


// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //在请求中携带token(这里创建userSrote对象必须写在这里，不能写在外面)
  const userSrote = useUserSrote()
  config.headers.token = userSrote.token

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  let msg = ''
  const status = error.response.status
  switch (status) {
    case 401:
      msg = 'token过期'
      break
    case 403:
      msg = '无权访问'
      break
    case 404:
      msg = '请求地址错误'
      break
    case 500:
      msg = '服务器异常'
      break
    default:
      msg = '网络异常'
      break
  }
  ElMessage.error(msg)
  return Promise.reject(error);
});

export default request;