import React from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
let SearchHeader = (props)=>{
  return <div className="searchBox">
  <div className="inputbg">
    <div onClick={()=>{props.history.push('/city')}} className="city">
      <span>{props.cityName}</span>
    </div>
    <div className="inputk">
      <input type="text" placeholder="请输入小区名或地址"/>
    </div>
    {/* <i className="iconfont icon-seach"></i> */}
  </div>
  <i className="iconfont icon-map" onClick={()=>{props.history.push('/map')}}></i>
</div>
}
// 校验父组件传递的参数类型
SearchHeader.propTypes ={
  cityName:PropTypes.string
}
// 如果父组件没有传参，设置默认参数
SearchHeader.defaultProps={
  cityName:'北京'
}
export default withRouter(SearchHeader)