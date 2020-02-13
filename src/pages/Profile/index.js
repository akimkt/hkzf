import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal} from 'antd-mobile'

import { BASE_URL } from '../../utils/url'
import {API} from '../../utils/api'
import styles from './index.module.css'
import {isAuth,removeToken} from '../../utils/token'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class Profile extends Component {
  state={
    islogin:isAuth(),
    avatar:'',
    nickname:''
  }
  componentDidMount(){
    //如果用户已登录，就获取用户资料
    this.state.islogin && this.getUserInfo()
  }
  // 获取用户资料
  getUserInfo=async ()=>{
    try {
      let res = await API.get('/user')
      if(res.status===200){
        let {avatar,nickname} = res.body
        this.setState({
          avatar:avatar,
          nickname:nickname
        })
      }
    } catch(e){
      console.log(e)
      throw e
    }
  }
  logout=()=>{
    // 进行确认
    Modal.alert('退出', '确定要退出登录?', [
      { text: '取消', onPress: () => {return false} },
      { 
        text: '确定退出', 
        onPress: () => {
          // 删除token，清除用户信息，设置islogin为false
          this.setState({
            avatar: '',
            nickname: '',
            islogin: false
          })
          removeToken()
        } 
    },
    ])
  }
  render() {
    const { history } = this.props
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={this.state.avatar?BASE_URL+this.state.avatar : DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{this.state.nickname||'游客'}</div>
              {/* 三元运算显示 */}
              { this.state.islogin&&this.state.nickname ?
              // 已登录
                <>
                <div className={styles.auth}>
                  <span onClick={this.logout}>退出</span>
                </div>
                <div className={styles.edit}>
                  编辑个人资料
                  <span className={styles.arrow}>
                    <i className="iconfont icon-arrow" />
                  </span>
                </div>
              </>
              :
              // 未登录
              <div className={styles.edit}>
              <Button
                type="primary"
                size="small"
                inline
                onClick={() => history.push('/login')}
              >
                去登录
              </Button>
              </div>
              }
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
