import axios from 'axios'
import {BASE_URL} from './url'
import { Toast } from 'antd-mobile';
const API = axios.create({
    baseURL : BASE_URL
    
})
// 请求拦截 在每次请求头中携带token
API.interceptors.request.use(config => {
    // 成功拦截
    // 修改请求配置  修改的是headers  获取token  配置token
    Toast.loading('加载中', 0)
    return config
  }, err => Promise.reject(err))
  API.interceptors.response.use(res => {
    // 处理响应
    // 调用接口的时候  then() 的传参就是现在的return
    // res.data 响应内容  res.data.data 才是有效数据
    try {
      Toast.hide()
      return res.data
    } catch (e) {
      Toast.hide()
      return res
    }
  })
export {API}