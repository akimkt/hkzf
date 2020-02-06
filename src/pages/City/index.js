import React from 'react'
import {Toast} from 'antd-mobile';
import './index.scss'
import {API} from '../../utils/api'
// 导入封装的 获取当前城市信息函数
import { getCurrentCity } from '../../utils'

// 导入依赖包 List 实现长列表 可视区域渲染（懒渲染）
// AutoSizer 实现宽度和高度自适应
import {List,AutoSizer} from 'react-virtualized';
import NavHeader from '../../components/NavHeader'
//声明数据，用于判断点击选择的城市是否有房源，除数组中包含的城市外，其他市提示没有房源
const HostCity = ['北京','上海','广州','深圳']

export default class Citys extends React.Component{
    state={
        cityList:{},// 城市数据按首字母进行分类，所以用对象，每个属性值是一个数组。
        cityIndex:[],// 右侧数据索引
        activeIndex:0// 默认的选中索引
    }
    // 声明ref对象
    listRef = React.createRef()
    componentDidMount(){
        this.getCityList()
    }
    
    getCityList= async ()=>{
        try{
        // 获取城市列表数据
        let data = await API.get('/area/city?level=1')
        // 调用方法处理数据成想要的格式
        let { cityList,cityIndex} = this.formatCityList(data.body)

        // 获取热门城市数据，整合数据
        let hotRes = await API.get('/area/hot')
        cityList['hot'] = hotRes.body
        cityIndex.unshift('hot')
        // 获取当前城市定位，再次整合
         let currentCity = await getCurrentCity()
         cityList['#'] = [currentCity]
         cityIndex.unshift('#')
         // 最终数据，赋值备用
         this.setState({
            cityList,
            cityIndex,
         })
        }catch(e){
            return e
        }

    }
    
    // 城市列表数据处理函数
    formatCityList(list){
        const cityList={}
        list.forEach(item=>{
            // 截取每条数据的short首字母,查找如果里面没有就设此属性为空数组
            let word = item.short.substr(0,1)
            //短路写法 
            cityList[word] = cityList[word] || []
            cityList[word].push(item)
        })
        // 获取对象cityList的所有属性（首拼）
        let cityIndex = Object.keys(cityList).sort()
        return{
            cityList,
            cityIndex
        }
    }
    // 左侧列表数据渲染
    rowRenderer=({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
      }) =>{
          // 获取每组的元素（城市字母首拼）
          const  word= this.state.cityIndex[index]
        return (
          <div key={key} style={style}>
            <div className="title">
                {this.formatCityKey(word)}
            </div>
            {this.state.cityList[word].map((item,key)=>{
                return <div className="name" key={item.value} onClick={()=>{this.changeCity(item)}}>
                    {item.label}
                </div>
            })}
          </div>
        );
      }
      // 行标题的处理函数
      formatCityKey=(word)=>{
        if(word==='#'){
            return '当前城市'
        }else if(word==='hot'){
            return '热门城市'
        }else{
            return word.toUpperCase()
        }
    }
      // 动态行高 react-virtualized的list组件提供一种方法rowHeight对应的函数会收到一个对象里面有index。
    getRowHeight=({index})=>{
        let word = this.state.cityIndex[index]
        let wordCityList = this.state.cityList[word]
        return 36+50*wordCityList.length
    }
    // 渲染右侧数据
    renderIndex=()=>{
        return this.state.cityIndex.map((item,index)=>(
        <li 
        key={index} 
        className={this.state.activeIndex===index?'active':''}
        onClick={()=>{
            // 点击获取到列表对象，然后滚动到对应的行 
            // this.listRef.current是列表元素对象，
            // scrollToRow是list的确保指定索引行在可视窗口的函数，配合scrollToAlignment设置可见位置
            this.listRef.current.scrollToRow(index)
            // console.log()
        }}
        >{/*如果为hot，则为热，否则转换成大写*/}
            {item==='hot'?'热':item.toUpperCase()}
        </li>
        ))
    }
    // 当页面滑动或滚动时，onRowsRendered list组件的属性，是一个函数，监听滚动显示的行号
    changeActiveIndex=({startIndex})=>{
        // 如果滚动后行号没变，不处理结束，如果变了就赋值
        if(startIndex===this.state.activeIndex)return false
        this.setState({
            activeIndex:startIndex
        })
    }
    // 点击城市名切换城市，通过页面固定数据对比
    changeCity=(item)=>{
        var flag = HostCity.indexOf(item.label)
        if(flag===-1){
            Toast.info('当前城市暂无房源',1)
        }else{
            localStorage.setItem('currentCity',JSON.stringify(item))
            this.props.history.push('/home/index')
        }
        item=null// 闭包变量，回收
        console.log("闭包内存回收完成")
    }
    render () {
        return <div className="cityList">
            {/* 城市选择的头部导航 */}
            <NavHeader>城市列表</NavHeader>

            {/* 城市选择列表 */}
            {/* 箭头函数简写，相当于将把结构传给另一个组件AutoSizer，AutoSizer通过this.props.children处理并将实参传入 */}
            <AutoSizer>
            {({height,width})=>(
                <List
                className="list"
                ref={this.listRef}// 用于获取列表元素
                width={width}
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}//动态获取行高
                rowRenderer={this.rowRenderer}// 循环行结构渲染函数
                scrollToAlignment='start'//设置scrollToRow在可见区域的位置
                onRowsRendered={this.changeActiveIndex}//当列表滚动时
            />
            )}
            </AutoSizer>
            <ul className="renderIndex">
                {this.renderIndex()}
            </ul>
        </div>
    }
}