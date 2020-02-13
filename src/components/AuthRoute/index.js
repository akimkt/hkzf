import React, { Component } from 'react';
import {Route,Redirect} from 'react-router-dom'

import { isAuth } from '../../utils/token'
export default class AuthRoute extends Component {
  render() {
      // exact默认为true，由外部定义
      // 路由url也通过外部定义
      // 显示的组件也由外部定义
      let {exact,path,Page} =this.props
    return (
        <Route exact={exact} path={path} render={(newProps)=>{
          // 如果已登录，返回对应组件否则跳转去登录页
            if(isAuth){
              // 将props展开传过去，在对应组件中就可以this.props访问了，否则在对应组件中this.props是空对象。
              return <Page {...newProps}></Page>
            }
            else{
             return <Redirect 
             to={{
               pathname:'/login',
               // 传一个对象state给登录页面，用于登录后实现跳回
               state:{
                 from:newProps.location.pathname
               }
            }}
             ></Redirect>
            }
          }} />
    );
  }
}
