import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state={
    value:this.props.defaultValue// 将父组件传过来的默认选中数据存储
  }
  // 当选择条件时，赋值存储用户选择
  onChange=(val)=>{
    this.setState({
      value:val
    })
  }
  render() {
    return (
      <>
        {/* 选择器组件： */}
        <PickerView 
          data={this.props.pickerData}//父组件传来的当前分类可选数据
          value={this.state.value} // 当前分类选中的数据
          cols={this.props.cols} // 分类可选数据的列数
          onChange={this.onChange}// 当用户滑动选择时重新赋值选中的数据
          />

        {/* 底部按钮 */}
        {/* 点击保存，传值获取当前选择的类型和当前用户选择的数据 */}
        <FilterFooter onCancel={this.props.onCancel} onSave={()=>{this.props.onSave(this.props.type,this.state.value)}}/>
      </>
    )
  }
}
