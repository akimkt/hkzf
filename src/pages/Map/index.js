import React, {Component} from 'react'
import NavHeader from '../../components/NavHeader'
import {API} from '../../utils/api'
import styles from './index.module.scss'
import {Toast} from 'antd-mobile'
// 调用工具，获取当前城市定位
import { getCurrentCity } from '../../utils'
// 给BMap加window前缀
const BMap= window.BMap
export default class Map extends Component {
    state={
        list:[],
        count:0,
        showList:false
    }
    componentDidMount(){
        this.InitMap()
    }
    // 初始化地图
    InitMap= async ()=>{
        
        //地图实例后面还需要用，所以创建成当前组件的内置变量
        this.map = new BMap.Map("container"); // 创建地图实例
        //  1. 获取城市名称 解构赋值，把对象里label的值赋值给word了,value是id
        let  {label:word,value} = await getCurrentCity()
        // 2. 通过地名，解析地址获取经纬度
        var myGeo = new BMap.Geocoder();   // 创建地址解析器实例
        // 第一个参数是详细地址，第二个参数是回调函数（参数是对象，有经纬度），第三个参数是市区 
        myGeo.getPoint(word, (point)=>{
        // 3. 通过经纬度生成地图
            if (point) {// point直接给centerAndZoom就可以用，不用new BMap.Point(lng, lat)
                
                // 初始化地图，设置中心点坐标和地图缩放级别
                this.map.centerAndZoom(point, 11);
                // 4. 设置地图控件
                this.map.addControl(new BMap.NavigationControl());  //  缩放控件
                this.map.addControl(new BMap.ScaleControl()); // 比例尺控件
            }
        },word);
        // 5.调用方法获取数据和渲染数据
         this.renderOverlays(value)
    }
    // 获取租房数据和渲染租房数据
    renderOverlays= async (id,shape)=>{
        Toast.loading('加载中',0)
        let data = await API.get('/area/map?id='+id)
        if(data.status){
            data.body.forEach(item=>{
                    this.creatOverlay(item,shape)
            })
        }
        Toast.hide()
    }
    // 创建单个渲染层的渲染方法
    creatOverlay(item ,shape){
        // 创建当前覆盖层的中心点坐标 当点击的时候 以此点为定位中心 进行缩放
        var point  = new BMap.Point(item.coord.longitude, item.coord.latitude);
        var opts = {
            position : point,    // 指定覆盖层所在的位置
            offset   : new BMap.Size(-35, -35)    //设置偏移量
            }
            var label = new BMap.Label("", opts);  // 创建文本标注对象
            label.setStyle({
                border:0,
                padding: 0,
                backgroundColor:'rgba(255, 255, 255, 0)',
                cursor: 'pointer'
            });
            // 设置覆盖层 通过参数shape控制覆盖层的样式
            label.setContent(`
        <div class="${shape==='squar'?styles.rect:styles.bubble}">
            <p>${item.label}</p>
            <p>${item.count}套</p>
        </div>
        `);
        // 给每个覆盖层设置监听点击事件
        label.addEventListener('click',(e)=>{
            // 获取点击的坐标
            let {clientX,clientY}=e.changedTouches[0]
            // 获取中心点的坐标
            let centerX = window.innerWidth/2
            let centerY = (window.innerHeight-330)/2
            // 获取地图位移的x和y值 相对中心点的位移
            let moveX = centerX-clientX
            let moveY = centerY-clientY
            // 移动指定距离
            this.map.panBy(moveX,moveY)
            // 点击覆盖物后的执行函数
            this.clickLayer(point,item.value)
        })
        //初始化覆盖层
        this.map.addOverlay(label);
}
    // 点击覆盖层
    clickLayer=(point,id)=>{
        let zoom = this.map.getZoom()// 获取当前层
        if(zoom===11){
            // 清除之前生成的覆盖层 由于百度地图存在bug必须设置清除方法为异步，否则会有报错
            setTimeout(()=>{
                this.map.clearOverlays()
            },0)
            // 重新定位中心点和缩放地图
            this.map.centerAndZoom(point, 13);
            // 重新请求和渲染覆盖层
            this.renderOverlays(id)
        }else if(zoom===13){
            // 清除之前生成的覆盖层 由于百度地图存在bug必须设置清除方法为异步，否则会有报错
            setTimeout(()=>{
                this.map.clearOverlays()
            },0)
            // 重新定位中心点和缩放地图
            this.map.centerAndZoom(point, 15);
            // 重新请求和渲染覆盖层 传一个字符串矩形
            this.renderOverlays(id,'squar')
        }else if(zoom===15){
            console.log('展示列表')
            this.showHouseList(id)
            this.map.addEventListener('movestart',()=>{
                this.setState({
                    showList:false
                })
            })
        }
    }
    // 获取房屋列表数据
    showHouseList=async (cityId)=>{
        // 显示loading
        Toast.loading('正在加载...',0)
        let data = await API.get('/houses',{
            params:{
                cityId
            }
        })
        Toast.hide()
        if(data.status===200){
            this.setState({
                list:data.body.list,
                count:data.body.count,
                showList:true
            }) 
        }
    }
    // 循环 渲染房屋列表
    renderList=()=>{
        if(this.state.list.length){
            return this.state.list.map(item=>(
                <div key={item.houseCode} className={styles.li} onClick={()=>{this.props.history.push('/hsdetail/'+item.houseCode)}}>
                    <img src={'http://localhost:8080'+item.houseImg} alt={item.title}/>
                    <div className={styles.item}>
                        <div className={styles.housetit}>{item.title}</div>
                        <div className={styles.desc}>{item.desc}</div>
                        <div className={styles.tags}>
                            {item.tags.map((tag,index)=>(
                                <div className={styles['tag'+index]} key={index}>{tag}</div>
                            ))}
                        </div>
                        <div className={styles.price}>
                            <b>{item.price}</b>元/月
                        </div>
                    </div>
                </div>
                )
            )
        }else{
            return null
        }
    }
    render(){
        return <div className={styles.map}>
            <NavHeader>地图找房</NavHeader>
            <div id="container">
            </div>
            <div className={[styles.houseList,this.state.showList?styles.show:''].join(' ')}>
                <div className={styles.tit}>
                    <h3>本小区房源</h3>
                    <a href="/">查看更多</a>
                </div>
                <div className={styles.items}>
                    {this.renderList()}
                </div>
            </div>
        </div>
    }
}