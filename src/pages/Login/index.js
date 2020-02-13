import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Flex, WingBlank, WhiteSpace,Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import {API} from '../../utils/api'
import { withFormik,Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'
import {setToken} from '../../utils/token'
// import { string, object } from 'yup';

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage className={styles.error} name="username"/>
            {/* 如果有对应的错误就显示错误 */}
            {/* {errors.username && <div >{errors.username}</div> } */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage className={styles.error} name="password"/>
            {/* {errors.password && <div className={styles.error}>{errors.password}</div> } */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
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

export default withFormik({
  // 将表单中的数据以对象Values添加到Props中进行交互
  mapPropsToValues: () => ({ username:'ssn104',password:'07162534' }),
  // 校验方式1  validate
/*   validate: values => {
    const errors = {};
    if (values.username==='') {
      errors.username = '用户名不能为空';
    }
    if(values.password===''){
      errors.password ='密码不能为空'
    }
    return errors;
  }, */
  // 校验方式2
  validationSchema:yup.object().shape({
    username:yup.string().required('用户名不能为空').matches(/^[a-zA-Z]\w{5,11}$/,'必须以字母开头长度为6到12位，只能出现数字、字母、下划线'),
    password:yup.string().required('密码不能为空').matches(/^\w{6,16}$/,'长度为6到16位，只能出现数字、字母、下划线'),
  }),
  // 点击提交的处理函数
  handleSubmit: async (values, { props }) => {
    // 发送登录请求，登录成功存储token

    let res = await API.post('/user/login',values)
    if(res.status===200){
      Toast.success('登录成功',1) 
      setToken(res.body.token)
      // 如果有来源地址就跳回来源页面，否则就跳回上一页
      if(props.location.state){
        props.history.push(props.location.state.from)
      }
      else{
        props.history.go(-1)
      }
      
    }
  }
})(Login)
