import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import { BASE_URL } from '../../utils/url'

import styles from './index.module.css'
import {API} from '../../utils/api'
import {isAuth} from '../../utils/token'

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg:  '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    houseImg: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    houseImg:'/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

export default class HouseDetail extends Component {
  state = {
    isLoading: true,
    isFavorite:false,
    houseInfo: {
      // 房屋图片
      slides: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: '',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  }

  componentDidMount() {
    // 获取房屋详情信息
    this.gethousedetail()
    // 确认是否已收藏
    this.getFavorite()
  }
  gethousedetail= async ()=>{
    let id = this.props.match.params.id
    let res = await API.get('/houses/'+id)
    if(res.status===200){
      let data = res.body
      let newdata = {
        ...this.state.houseInfo,
        ...data
      }
      // 保存数据
      this.setState({
        houseInfo:newdata,
        isLoading:false
      })

    //调用函数渲染地图
    this.renderMap(data.community,data.coord)
    }
  }
  // 渲染轮播图结构
  renderSwipers() {
   const {houseInfo: { houseImg }} = this.state
   return houseImg.map(item => (
      <a
        key={item}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 252
        }}
      >
        <img
          src={BASE_URL + item}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }
  // 确认是否已收藏
  getFavorite= async ()=>{
    // 如果已登录，才操作
    if(isAuth){
      //获取当前房屋id
      let id = this.props.match.params.id
      // 发送请求获取当前房屋是否收藏
      let res = await API.get('/user/favorites/'+id)
      console.log(res)
      // 获取获取成功就赋值
      if(res.status===200){
        this.setState({
          isFavorite:res.body.isFavorite
        })
      }//如果获取不成功，应该处理错误问题，比如token过期,比如没有登录
      else if(res.status===400){
        //根据需求操作，如果不需要处理，则默认未收藏
      }
    }
  }
  // 点击收藏或取消收藏
  handelfavorite= async()=>{
    // 如果没有登录，提示需要登录后才能收藏
    if(!isAuth()){
      Modal.alert('登录提示', '登录后才能收藏', [
        { text: '取消', onPress: () =>{}},
        { text: '去登陆', onPress: () => this.props.history.push('/login') },
      ])
    }else{
      // 获取当前传参 房屋id
      let id = this.props.match.params.id
      // 如果已登录执行收藏或取消收藏
      if(this.state.isFavorite){// 如果已收藏发请求取消收藏
        let res = await API.delete('/user/favorites/'+id)
        if(res.status===200){
          this.setState({
            isFavorite:false
          })
        }

      }else{// 否则收藏
        let res = await API.post('/user/favorites/'+id)
        if(res.status===200){
          this.setState({
            isFavorite:true
          })
          Toast.success('收藏成功',2)
        }
      }
    }
  }
  render() {
    const { isLoading,houseInfo:{price,roomType,size,renovation,floor,oriented,community,title,supporting} } = this.state
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {title}
        </NavHeader>
        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            {}
          </h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              <span className={[styles.tag, styles.tag1].join(' ')}>
                随时看房
              </span>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
          <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                {renovation||'精装修'}
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>{oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          <HousePackage
            list={supporting}
          />
          {/* <div className="title-empty">暂无数据</div> */}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {/* {description || '暂无房屋描述'} */}
              1.周边配套齐全，地铁四号线陶然亭站，交通便利，公交云集，距离北京南站、西站都很近距离。
              2.小区规模大，配套全年，幼儿园，体育场，游泳馆，养老院，小学。
              3.人车分流，环境优美。
              4.精装两居室，居家生活方便，还有一个小书房，看房随时联系。
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handelfavorite}>
            <img
              src={BASE_URL + (this.state.isFavorite?'/img/star.png':'/img/unstar.png')}
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>{this.state.isFavorite?'已收藏':'收藏' }</span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
