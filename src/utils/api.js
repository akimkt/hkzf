import axios from 'axios'
import {BASE_URL} from './url'
import {getToken} from './token'
import { Modal } from 'antd-mobile'
// import { Toast } from 'antd-mobile';
const API = axios.create({
    baseURL : BASE_URL
    
})
// 请求拦截 常用于修改请求配置  修改的是headers  获取token  配置token
API.interceptors.request.use(config => {
    // 如果是用户相关的请求，并且不是登录或注册
    if(config.url.startsWith('/user') && config.url!=='/user/login' && config.url!=='/user/registered'){
      config.headers.authorization=getToken()
    }      
      return config
    }, err => Promise.reject(err)
)

  // 响应拦截
  API.interceptors.response.use(res => {
      // 如果报错信息是token过期，不返回直接重新发请求获取新的token？没有刷新token功能，智能跳转到登录
      // console.log(res.data)
      // if(res.data.status===400){
      //   Modal.alert('请登录', '您尚未登录或登录过期！', [
      //     { text: '取消', onPress: () => false },
      //     { text: '去登陆', onPress: () => window.location.href="/login" },
      //   ])
      // }
      
    // 处理响应
    // 调用接口的时候  then() 的传参就是现在的return
    // res.data 响应内容  res.data.data 才是有效数据
    try {
      return res.data
    } catch (e) {
      return res
    }
  })
export {API}