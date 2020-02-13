import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {  BASE_URL } from '../../utils/url'
import {  API } from '../../utils/api'
import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'
import styles from './index.module.css'
export default class Favorate extends Component {
    state={
        list:[],
        loaded:false
    }
  componentWillMount(){
      this.getfavorate()
  }
  // 获取收藏列表
  getfavorate= async ()=>{
      let res =  await API.get('/user/favorites')
      console.log(res)
    const { status, body } = res
    if (status === 200) {
      this.setState({
        list: body,
        loaded:true
      })
    }// 如果获取失败，响应拦截器 处理
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
          您还没有收藏过，
          <Link to="/home/houselist" className={styles.link}>
            去选房
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
        <NavHeader onLeftClick={() => history.go(-1)} className={styles.header}>收藏列表</NavHeader>

        {this.renderRentList()}
      </div>
    )
  }
}
