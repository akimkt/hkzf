import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'
import {API} from '../../utils/api'
import { withFormik,Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'
import styles from './index.module.css'

class Registe extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>注册</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <label className={styles.label}>用户名</label>
              <Field className={styles.input}
              type="text"
              name="username" 
              placeholder="请输入账号" />
            </div>
            <ErrorMessage className={styles.error} name="username"/>
            <div className={styles.formItem}>
              <label className={styles.label}>密码</label>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage className={styles.error} name="password"/>
            <div className={styles.formItem}>
              <label className={styles.label}>重复密码</label>
              <Field
                className={styles.input}
                name="password2"
                type="password"
                placeholder="请重新输入密码"
              />
            </div>
            <ErrorMessage className={styles.error} name="password2"/>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                注册
              </button>
            </div>
            
          </Form>
          <Flex className={styles.backHome} justify="between">
            <Link to="/home">点我回首页</Link>
            <Link to="/login">已有账号，去登录</Link>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
export default withFormik({
  // 将表单中的数据以对象Values添加到Props中进行交互
  mapPropsToValues: () => ({ username:'test2',password:'test2',password2:'test2' }),
  // 校验方式2
  validationSchema:yup.object().shape({
    username:yup.string().required('用户名不能为空').matches(/^[a-zA-Z]\w{5,11}$/,'必须以字母开头长度为6到12位，只能出现数字、字母、下划线'),
    password:yup.string().required('密码不能为空').matches(/^\w{6,16}$/,'长度为6到16位，只能出现数字、字母、下划线'),
    password2:yup.string().required('请输入确认密码').matches(/^\w{6,16}$/,'长度为6到16位，只能出现数字、字母、下划线'),
  }),
  // 点击提交的处理函数
  handleSubmit: async (values, { props }) => {
    // 发送注册请求
    let res = await API.post('/user/registered',values)
    console.log(res)
    if(res.status===200){
      Toast.success(res.description,1)

      let {token} = res.body
      window.localStorage.setItem('hkzftoken',token)
      props.history.replace('/login')
    }else if(res.status===400){
      Toast.success(res.description,1)
    }
  }
})(Registe)