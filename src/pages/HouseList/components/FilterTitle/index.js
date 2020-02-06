import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]
const renderTitle=(props)=>{
  return titleList.map((item,index)=>{
    // 获取父组件传递的默认状态 类决定标题是否显示选中样式
    const type =props.titlestate[item.type]
    return <Flex.Item key={item.type}>
    {/* 选中类名： selected */}
    <span className={[styles.dropdown, type? styles.selected:''].join(' ')} onClick={()=>{props.clickTitle(item.type)}}>
      <span>{item.title}</span>
      <i className="iconfont icon-arrow" />
    </span>
  </Flex.Item>
  }
  )
}
export default function FilterTitle(props) {
  return (
    <Flex align="center" className={styles.root}>
      {renderTitle(props)}
    </Flex>
  )
}
