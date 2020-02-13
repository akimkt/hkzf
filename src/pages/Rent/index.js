import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Modal } from 'antd-mobile'
import {  BASE_URL } from '../../utils/url'
import {  API } from '../../utils/api'
import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'
import styles from './index.module.css'

 class Rent extends Component {
  state = {
    // 出租房屋列表
    list: [],
    loaded:false
  }
  componentDidMount() {
    this.getHouseList()
  }

  // 获取已发布房源的列表数据
   async getHouseList () {
    const res = await API.get('/user/houses')
    const { status, body } = res
    if (status === 200) {
      this.setState({
        list: body,
        loaded:true
      })
    }// 如果获取失败，响应拦截器 处理
    else if(res.status===400){
        Modal.alert('请登录', '您尚未登录或登录过期！', [
          { text: '取消', onPress: () => false },
          { text: '去登陆', onPress: () => window.location.href="/login" },
        ])
      }
  }
  renderHouseItem=() =>{
    const { list } = this.state
    const { history } = this.props
    return list.map(item => {
      return (
        <HouseItem
          key={item.houseCode}
          onClick={() => history.push(`/detail/${item.houseCode}`)}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    })
  }

  renderRentList() {
    const { list,loaded } = this.state
    // 如果已请求完成，却没有数据
    if (!list.length && loaded) {
      return (
        <NoHouse>
          您还没有房源，
          <Link to="/rent/add" className={styles.link}>
            去发布房源
          </Link>
          吧~
        </NoHouse>
      )
    }

    return <div className={styles.houses}>{this.renderHouseItem()}</div>
  }

  render() {
    const { history } = this.props
    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={() => history.go(-1)} className={styles.header}>房屋管理</NavHeader>

        {this.renderRentList()}
      </div>
    )
  }
}

export default  Rent