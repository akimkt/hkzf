import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace,Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import {API} from '../../utils/api'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state={
    username:'test2',
    password:'test2'
  }
  // 输入框内字符改变时，如果改变后的值不为空，保存
  datachange=(e)=>{
    if(e.target.value){
      this.setState({
        [e.target.name]:e.target.value
      })
    }
  }
  // 点击登录提交登录
  handlesubmit= async (e)=>{
    e.preventDefault()
    let {username , password} = this.state
    //校验用户名
    let RegUser = /^[a-zA-Z]\w{4,10}$/
    if(!username.trim()||!RegUser.test(username)){
      Toast.info('用户名错误',2)
      return false
    }
    // 校验密码
    let RegP = /^[a-zA-Z]\w{4,15}$/
    if(!password.trim()||!RegP.test(password)){
      Toast.info('密码错误',2)
      return false
    }
    // 发送登录请求，登录成功存储token
    let res = await API.post('/user/login',this.state)
    if(res.status===200){
      Toast.success('登录成功',1)
      let {token} = res.body
      window.localStorage.setItem('hkzftoken',token)
    }
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={this.handlesubmit}>
            <div className={styles.formItem}>
              <input
                value={this.state.username}
                onChange={this.datachange}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                value={this.state.password}
                onChange={this.datachange}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
