import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state={
    selectedValues:this.props.defaultValue
  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item=>(
      <span 
      key={item.value} 
      className={[styles.tag, this.state.selectedValues.includes(item.value)?styles.tagActive:'' ].join(' ')}
      onClick={()=>{
        this.tagClick(item.value)
      }}
      >{item.label}</span>
      )
    )
  }
  // 点击标签，如果选择的数据中没有当前id，push进去，如果有则删除
  tagClick=(id)=>{
    let newVal = this.state.selectedValues
    let index = newVal.findIndex(item=>item===id)
    if(index===-1){
      newVal.push(id)
    }else {
      newVal.splice(index,1)
    }
    this.setState({
      selectedValues:newVal
    })
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={this.props.onCancel}/>

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(this.props.pickerData.roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(this.props.pickerData.oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(this.props.pickerData.floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(this.props.pickerData.characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer}
        onSave={()=>{this.props.onSave('more',this.state.selectedValues)}} 
        cancelText='清除'
        onCancel={()=>{
          this.setState({
            selectedValues:[]
          })
        }} 
        />
      </div>
    )
  }
}
