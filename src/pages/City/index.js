import React from 'react'
import { NavBar,Icon} from 'antd-mobile';
export default class Citys extends React.Component{
    render(){
        return <div className="city">
                <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() =>this.props.history.goBack()}>城市选择</NavBar>
        </div>
    }
}