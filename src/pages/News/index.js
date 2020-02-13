import React from 'react'
import {Flex,WingBlank} from 'antd-mobile'
import { API } from '../../utils/api'
import {getCurrentCity} from '../../utils'
import NavHeader from '../../components/NavHeader'
import './index.scss'
export default class News extends React.Component{
    state = {
        news:[]
    }
    componentWillMount(){
        this.getNews()
    }
    async getNews(){
        // 获取定位城市
      let position = await getCurrentCity()
      // 发送请求获取资讯列表数据，赋值渲染
      let res = await API.get('/home/news',{params:{area:position.value}})
        if(res.status===200){
            this.setState({
                news:res.body
              })
        }

    }
    // 渲染最新资讯
  renderNews() {
    console.log(this.state.news)
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
    render(){
        return <div className="news">
        <h3 className="group-title">最新资讯</h3>
        <WingBlank size="md">{this.renderNews()}</WingBlank>
      </div>
    }
}