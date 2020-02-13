import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import {API} from '../../../../utils/api'
import { getCurrentCity } from '../../../../utils'

import styles from './index.module.css'

const titleSelectedStatus = {
  area: false,//区域
  mode: false,//方式
  price: false,// 租金
  more: false //筛选more
}
const selectedValues = {
  area: ["area", null],
  mode: ["null"],
  price: ["null"],
  more: []
}
export default class Filter extends Component {
  state = {
    titleState:titleSelectedStatus,// 四个标题的选中状态
    openType:'',//点击打开的摘选标题
    ckPickerData:null,//房屋查询条件数据
    selectedValues// 筛选默认选中的数据
  }
  componentDidMount(){
    // 初始化的时候就获取筛选条件数据
    this.getPickerData()
  }
  // 获取房屋查询条件的所有数据并存储
  async getPickerData(){
    let currentCity = await getCurrentCity()
    const data = await API.get('/houses/condition',{
      params:{
        id:currentCity.value
      }
    })
    if(data.status===200){
      this.setState({
        ckPickerData:data.body
      })
    }
  }
  //点击筛选标题
  clickTitle=(type)=>{
    let newStatus = {...this.state.titleState}// 获取所有标题状态
    let newValues = {...this.state.selectedValues}// 获取所有用户的选择数据
    for(let key in newStatus){
      // 获取用户选择数据中的每个成员值
      let selVal = newValues[key]
      // 遍历遇到当前点击的数据，直接设置为选中状态，结束本轮，继续下一轮
      if(type===key){
        newStatus[key]=true
        continue
      }
      // 区域数据中，如果长度大于2或者虽然是2但选项不是默认area，那么就是已选择状态
      if(key==='area' &&(selVal.length>2 || (selVal.length===2&&selVal[0]!=='area'))){
        newStatus[key]=true
      }
      // 如果是mode或price并且有选值
      else if((key==='mode' || key==='price')&&selVal[0] !== 'null'){
        newStatus[key]=true
      // 如果是筛选并且筛选有值
      }else if(key==='more'&&selVal.length!==0){
        newStatus[key]=true
      }else{
          newStatus[key]=false
      }
    }
    this.setState({
      titleState:newStatus,
      openType:type
    })
  }
  //点击选择框的取消,如果当前类型没有数据，需要修改，因为在点击弹出时设置status为true了
  onCancel=()=>{
    let newStatus = {...this.state.titleState}// 获取所有标题状态
    let type=this.state.openType// 获取当前展示选择框对应的类型
    let selVal = this.state.selectedValues[type]// 当前类型的用户选择数据
    if(type==='area'&&(selVal.length!==2 || (selVal.length===2 && selVal[0]!=='area'))){
      newStatus[type]=true 
    }else if(type==='mode'&&selVal[0] !== 'null'){// 方式mode 并且有值
      newStatus[type]=true 
    }else if(type==='price'&&selVal[0] !== 'null'){// 租金 并且有值
      newStatus[type]=true 
    }else if(type==='more'&&selVal.length!==0){//筛选户型 并且有值
      newStatus[type]=true
    }else{
        newStatus[type]=false
    }
    this.setState({
      openType:'',// 关闭弹窗
      titleState:newStatus//所有标题高亮状态重新更新
    })
  }
  // 点击选择框的确定按钮 因为在点击标题弹出弹框是当前标题高亮了，需要判断有没有值，然后决定要不要高亮
  onSave=(type, value)=>{
    let newStatus = {...this.state.titleState}// 获取所有标题状态
    if(type==='area'&&(value.length!==2 || (value.length===2 && value[0]!=='area'))){
      newStatus[type]=true 
    }else if(type==='mode'&&value[0] !== 'null'){// 方式mode 并且有值
      newStatus[type]=true 
    }else if(type==='price'&&value[0] !== 'null'){// 租金 并且有值
      newStatus[type]=true 
    }else if(type==='more'&&value.length!==0){//筛选户型 并且有值
      newStatus[type]=true
    }else{
        newStatus[type]=false
    }
    // 记录用户的选择 清空openType控制隐藏按钮
    this.setState({
      selectedValues:{
        ...this.state.selectedValues,
      [type]:value
      },
      titleState:newStatus,//所有标题高亮状态重新更新
      openType:''
      //在赋值完成后再把条件传值给houselist,保障数据正确完整
    },()=>{
      // 需要的格式和当前数据不同，所以先处理后再传过去，需要对象形式的数据
      let newselVal = {...this.state.selectedValues}
      let filters={}
      let areaName=newselVal.area[0]// 区域可能是subway或area需要设成变量
      let areaVal =''
      if (newselVal.area.length>2){//区域的值应该选最详细的
        areaVal = newselVal.area[2]==='null'?newselVal.area[1]:newselVal.area[2]
      }else{
        areaVal = newselVal.area[1]
      }
      filters[areaName]=areaVal
      filters.mode= newselVal.mode[0]
      filters.more=newselVal.more.join(',')// 后端要求筛选数据以,拼接成字符串
      filters.price=newselVal.price[0]

      // 将处理后的数据传给houselist
      this.props.onFilters(filters)
    })
  }
  renderPicker=()=>{
    // 获取当前打开的查询类型，可选数据,前三条的选中值数据
    let {openType,ckPickerData,selectedValues}=this.state
    let defaultValue =selectedValues[openType]//获取对应类型的选择数据值
    if(openType==='area' || openType==='mode' || openType==='price'){
      let data = []
      let cols=1
      // 处理数据，根据点击类型传值给picker组件，同时传值数据的列数
      switch (openType) {
        case 'area':
          data=[ckPickerData.area,ckPickerData.subway]
          cols=3
          break;
        case 'mode':
          data=ckPickerData.rentType
          break;
        case 'price':
        data = ckPickerData.price
        break;
        default://eslint要求的，我设置默认什么也不做
      }
      return <FilterPicker 
      onCancel={this.onCancel} 
      onSave={this.onSave} 
      pickerData={data} 
      cols={cols}
      type={openType}//传递当前点击筛选类型，方便点击保存时从子组件再传回来进行选择的数据修改
      key={openType}
      defaultValue={defaultValue}/>
    }
    // 传值渲染筛选组件
    else if(openType==='more'){
      let data ={
        roomType:ckPickerData.roomType,// 户型
        oriented:ckPickerData.oriented,// 朝向
        floor:ckPickerData.floor,// 楼层
        characteristic:ckPickerData.characteristic// 类型
      }
      return <FilterMore 
      pickerData={data}  
      onCancel={this.onCancel} 
      onSave={this.onSave}
      defaultValue={defaultValue}
      key={openType}/>
    }
    else{
      return null
    }
  }
  renderMask(){
    let {openType}=this.state
    if(openType==='area' || openType==='mode' || openType==='price'){
      return <div className={styles.mask} />
    }else{
      return null
    }
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {this.renderMask()}
        <div className={styles.content}>
          {/* 标题栏 */}

          <FilterTitle titlestate={this.state.titleState} clickTitle={this.clickTitle}/>
          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}
          {this.renderPicker()}
          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
