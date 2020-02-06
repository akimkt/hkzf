import React from 'react'
import SearchHeader from '../../components/SearchHeader'
import {List, AutoSizer, WindowScroller } from 'react-virtualized'
import {Toast} from 'antd-mobile'
import { getCurrentCity } from '../../utils'
import styles from './index.module.scss'
import './index.scss'
import Filter from './components/Filter'
import {API} from '../../utils/api'
export default class HouseList extends React.Component{
    state={
        currentCity:'',
        list:[],
        count:0,
        start:1,
        end:20,
        isLoaded:false
    }
    filters={}// 默认查询条件为空对象注册到houselist组件中，当用户选择查询条件后赋值
    componentDidMount(){
        this.getCCity()
        
    }
        // 获取定位数据
    getCCity= async ()=>{
        let dingwei = await getCurrentCity()
        this.setState({
            currentCity:dingwei.label
        },()=>{
            // 获取到定位后发送请求获取所有租房数据
            this.getHouseList()
        })
        }
    // 循环 渲染房屋列表
    rowRenderer=({key, index, style}) => {
        let item = this.state.list[index]
        return (
          <div key={key} style={style}  className={styles.li}>
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
        );
      }
    // 当用户保存筛选条件时传值过来，在houselist中接收，
    onFilters= (filters)=>{
        this.filters = filters
        this.getHouseList()
    }
    // 发请求获取指定条件的房屋数据
    getHouseList = async ()=>{
        let data = await API.get('/houses',{
            params:{
                cityId:this.state.currentCity.value,
                ...this.filters,
                start:this.state.start,
                end:this.state.end
            }
        })
        console.log('data',data)
        if(data.status===200){
            this.setState({
                list:data.body.list,
                count:data.body.count,
                isLoaded:true
            })
            Toast.info(`总计${data.body.count}条数据`,2)
        }else{
            return data
        }
    }
    // 渲染列表页
    renderList=()=>{
        let {count,isLoaded} = this.state
        // if(count){// 如果有数据直接渲染
            // return <WindowScroller>
            // {({ height, isScrolling, onChildScroll, scrollTop }) => (
            //     <AutoSizer>
            //         {({width})=> (
            //             <List
            //                 autoHeight// WindowScroller必须写，自适应窗口高度
            //                 isScrolling={isScrolling}
            //                 onScroll={onChildScroll}
            //                 scrollTop={scrollTop}
            //                 height={height}
            //                 width={width}
            //                 rowCount={count}
            //                 rowHeight={120}
            //                 rowRenderer={this.rowRenderer}
            //             />
            //         )}
            //     </AutoSizer>
            // )}
            // </WindowScroller>
            return <WindowScroller>
                        {({ height, isScrolling, onChildScroll, scrollTop }) => (
                            <AutoSizer>
                            {({width}) => (
                                <List
                                // onRowsRendered={onRowsRendered} // 滚动的列表 必须加上 才能知道谁滚动
                                // ref={registerChild} // ref可以知道应该 更新哪个列表数据
                                autoHeight // 自适应高度 WindowScroller 必须加上
                                width={width}
                                height={height}
                                isScrolling={isScrolling} // 是否正在滚动
                                onScroll={onChildScroll} // 滚动事件
                                scrollTop={scrollTop} // 滚动出去的距离
                                rowCount={this.state.count} // 总条数
                                rowHeight={120}
                                rowRenderer={this.rowRenderer}
                                />
                            )}
                            </AutoSizer>
                        )}
            </WindowScroller>


            
            // 如果一经请求完了，并且没有数据，提示
        // }else if(isLoaded===true && count===0 ){
        //     return <div>换个筛选条件</div>
        // }else{
        //     return null
        // }
    }
    render(){
        return <div className={styles.houselist}>
            <div className={styles.header}>
                <i className="iconfont icon-back"></i>
                    <SearchHeader cityName={ this.state.currentCity}></SearchHeader>
            </div>
            <Filter onFilters={this.onFilters}></Filter>
            {/* 渲染租房数据列表 */}
            {this.renderList()}
        </div>
    }
}