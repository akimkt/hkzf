import React from 'react'
import { Carousel,Toast,Flex,Grid} from 'antd-mobile';
import axios from 'axios'
import './index.scss'
// 获取nav图标
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
// 设置nav数据 方便循环
const menus = [
  {id:1, name: '整租', imgSrc: nav1, path: '/home/list' },
  {id:2, name: '合租', imgSrc: nav2, path: '/home/list' },
  {id:3, name: '地图找房', imgSrc: nav3, path: '/map' },
  {id:4, name: '去出租', imgSrc: nav4, path: '/rent/add' }
]
export default class Index extends React.Component{
    state = {
        // 轮播图数据
        swipers: [],
        imgHeight: 176,
        autoPlay:false,
        // 租房小组数据
        groups:[],
        // 新闻资讯数据
        news:[],
        currentCity:''
    }
    // 获取轮播图数据
    async getSwiper(){
        const res = await axios.get('http://localhost:8080/home/swiper')
        if(res.data.status===200){
            this.setState({
              swipers: res.data.body
          },()=>{
            this.setState({
                autoPlay:true
            })
          });
        }
    }
    componentDidMount() {
        // 在获取前进行提示加载中
        this.loadingToast()
        // 获取焦点图数据 
        this.getSwiper()
        // 获取租房小组数据
        this.getGroups()
        // 获取资讯数据
        this.getNews()
        // 获取定位数据
        this.getCurrentCity()

    }
    // 根据用户IP 返回城市级别的定位结果
    getCurrentCity=()=>{
      let myFun=(result)=>{
        var cityName = result.name;
        this.setState({
          currentCity:cityName
        })
      }
      // 
      var myCity = new window.BMap.LocalCity();
      myCity.get(myFun); 
    }
    // 提示加载中
    loadingToast=()=>{
        Toast.loading('Loading...', 1, () => {
        });
      }
    //渲染轮播图结构
    renderSwiper=()=>{
      // 如果准备好了数据再渲染
        if(this.state.swipers.length){
            return <Carousel
            autoplay={this.state.autoPlay}
            infinite>
            {this.state.swipers.map(val => (
              <a
                key={val.id}
                href="http://www.akimkt.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                <img
                  src={`http://localhost:8080${val.imgSrc}`}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: 'auto' });
                  }}
                />
              </a>
            ))}
            </Carousel>
        }else{
            return <Carousel></Carousel>
        }
    }
    // 渲染nav导航
    renderNav(){
        return <Flex className="navbox">
          {menus.map(item=>(<Flex.Item onClick={()=>this.props.history.push(item.path)} key={item.id}>
            <img src={item.imgSrc} alt="" />
            <h4>{item.name}</h4>
        </Flex.Item>))}
      </Flex>
    }
    // 获取租房小组数据
    async getGroups(){
      const res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
      if(res.data.status===200){
        this.setState({
          groups: res.data.body
          })
      }
    }
    // 渲染租房小组数据
    renderGrid(){
      return <Grid
      data={this.state.groups}
      columnNum={2}
      // renderItem相当于arr.map
        renderItem={((el,index)=>(
          <Flex wrap="wrap" className="grid-item">
            <Flex.Item>
              <h4>{el.title}</h4>
              <p>{el.desc}</p>
            </Flex.Item>
            <Flex.Item>
            <img src={'http://localhost:8080'+el.imgSrc} alt="" />
            </Flex.Item>
          </Flex>
        )
      )}
      hasLine={false}
      square={false}
        activeStyle={false} />
    }
    // 获取资讯数据
    async getNews(){
      const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
      this.setState({
        news:res.data.body
      })
    }
    // 渲染资讯数据
    renderNewsLi(){
      return this.state.news.map(item=>(
        <div className="newsContent" key={item.id}>
          <img src={'http://localhost:8080'+item.imgSrc} alt=""/>
          <div className="rbox">
            <h5>{item.title}</h5>
            <p>
              <span>{item.from}</span>
              <span>{item.date}</span>
            </p>
          </div>
        </div>                    

      ))
    }
    // 渲染搜素结构
    renderSearch(){
      return <div className="searchBox">
        <div className="inputbg">
          <div onClick={this.goCity} className="city"><span>{this.state.currentCity}</span></div>
          <div className="inputk">
            <input type="text" placeholder="请输入小区名或地址"/>
          </div>
          {/* <i className="iconfont icon-seach"></i> */}
        </div>
        <i className="iconfont icon-map" onClick={this.goMap}></i>

      </div>
    }
    goCity=()=>{
      this.props.history.push('/city')
    }
    goMap=()=>{
      this.props.history.push('/map')
    }
    // 页面渲染
    render(){
        return  (
            <div className="index">
              {/* 轮播图 */}
                {this.renderSwiper()}
                {this.renderSearch()}
                {/* 导航 */}
                {this.renderNav()}
                {/* 租房小组 */}
                <div className="groups">
                  <div className="tit">
                    <h3>租房小组</h3>
                    <span>更多</span>
                  </div>
                    {this.renderGrid()}
                </div>
                {/* 最新资讯 */}
                <div className="news">
                  <h4>最新资讯</h4>
                    {this.renderNewsLi()}
                </div>
            </div>
        )
    }
}