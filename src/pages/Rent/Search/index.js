import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCurrentCity } from '../../../utils'

import styles from './index.module.css'
import { API } from '../../../utils/api'
let timer =null
export default class Search extends Component {
  // 当前城市id 存在异步问题
  // cityId = getCurrentCity().value
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: [],
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={()=>{this.selectCommunity(item)}}>
        {item.communityName}
      </li>
    ))
  }
  // 点击搜索结果列表中的小区
  selectCommunity =(value)=>{
      this.props.history.replace('/rent/add',value)
  }
  // 当输入搜素的小区关键字时修改数据，发送请求获取小区
  handelSearch= (keyword)=>{
    this.setState({
      searchTxt:keyword
    })
    //如果改变是清空文字 清除计时器结束函数 重置小区数据
    if(!keyword.trim()){
      clearTimeout(timer)
      this.setState({
        tipsList:[]
      })
      return false
    }
    // 如果有尚未发送的请求，先清除请求
    if(timer!==null){
      clearTimeout(timer);
      }
    // // 设置定时发送请求，防止短时间内重复发送
    timer = setTimeout(async ()=>{
      let city = await getCurrentCity()
      let res = await API.get('/area/community',{params:{id:city.value,name:keyword}})
      // 如果请求成功并且有数据
      if(res.status===200&&res.body.length){
        this.setState({
          tipsList:res.body
        })
      }
   },500)
  }
  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handelSearch}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
