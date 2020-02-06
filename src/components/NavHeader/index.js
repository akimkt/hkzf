import React, { Component } from 'react';
import {NavBar,Icon} from 'antd-mobile'
// 导入withRouter用于增强非路由组件，为其增加histroy
import {withRouter} from 'react-router'
// 导入校验包
import PropTypes from 'prop-types'
import style from './index.module.scss'
class NavHeader extends Component {
  render() {
    return (
        <NavBar
        className={[style.navbar,this.props.className||''].join(' ')}
        rightContent={this.props.rightContent}
        mode="dark"
        icon={<Icon type="left" />}
    onLeftClick={() =>this.props.history.goBack()}>{this.props.children}</NavBar>
    );
  }
}
// 在导出之前进行校验
NavHeader.propTypes={
  children:PropTypes.string,
  rightContent: PropTypes.array
}
// 设置默认值
NavHeader.defaultProps = {
  children:'导航填写位置',
  rightContent:[]
}
export default withRouter(NavHeader)