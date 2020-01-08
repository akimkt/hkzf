import React from 'react'
import {Route} from 'react-router-dom'
// 引入子组件
import Index from '../Index'
import List from '../List'
import News from '../News'
import Profile from '../Profile'
// 导入TabBar
import { TabBar } from 'antd-mobile'
// 引入字体图标
import '../../assets/fonts/iconfont.css'
// 引入自己的样式
import './index.scss'

// tabbar的数据是固定不变的
const tabs = [
    {
      title: '首页',
      icon: 'icon-ind',
      path: '/home/index'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/home/houselist'
    },
    {
      title: '资讯',
      icon: 'icon-infom',
      path: '/home/news'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/home/profile'
    }
  ]

export default class Home extends React.Component{
    state = {
        selectedTab: '/home/index',
        hidden: false
    }
    
    renderTabbar(){
        return tabs.map((item) => {
        return <TabBar.Item
        title={item.title}
        key="Life"
        icon={<i className={'iconfont '+item.icon}></i>}
        selectedIcon={<i className={'iconfont '+item.icon}></i>}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
        this.setState({
            selectedTab: item.path,
        });
        this.props.history.push(item.path)
        }}>
    </TabBar.Item>
        })
    }
    render(){
        return <div className="home">
            {/* 子路由组件位置 */}
            <Route path="/home/index" component={Index}></Route>
            <Route path="/home/list" component={List}></Route>
            <Route path="/home/news" component={News}></Route>
            <Route path="/home/profile" component={Profile}></Route>
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#21b97a"
                barTintColor="white"
                hidden={this.state.hidden}
                noRenderContent={true}>
                {this.renderTabbar()}
            </TabBar>
        </div>
    }
}