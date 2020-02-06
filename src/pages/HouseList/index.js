import React from 'react'
import SearchHeader from '../../components/SearchHeader'
import {List, AutoSizer, WindowScroller,InfiniteLoader } from 'react-virtualized'
import {Toast} from 'antd-mobile'
import { getCurrentCity } from '../../utils'
import styles from './index.module.scss'
import './index.scss'
import Ceiling from '../../components/Ceiling'
import NoHouse from '../../components/NoHouse';
import Filter from '../../pages/HouseList/components/Filter'
import {API} from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import {Spring} from 'react-spring/renderprops'
export default class HouseList extends React.Component{
    state={
        currentCity:'',
        list:[],
        count:0,
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
        // 上拉加载的判断是否有值,数据还没回来不执行渲染,而是提示加载中，解决加载渲染时数据还没回来报错的问题
        if(!item){
            return (
                <div key={key} style={style}>
                    <p className={styles.loading}>加载中</p>
                </div>
            )
        }
        return (
            <div 
            key={key} 
            style={style}  
            className={styles.li}
            onClick = {()=>{this.props.history.push('/hsdetail/'+item.houseCode)}}
            >
                        <img src={BASE_URL+item.houseImg} alt={item.title}/>
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
        // 如果用户的筛选条件没有变，不重新发请求
        if(this.filters===filters){
            return false
            }else{
                // 如果用户筛选条件变了，重新发请求，页面回滚到顶部
                this.filters = filters
                this.getHouseList()
                window.scrollTo(0,0)

            }
    }
    // 发请求获取指定条件的房屋数据
    getHouseList = async ()=>{
        let data = await API.get('/houses',{
            params:{
                cityId:this.state.currentCity.value,
                ...this.filters,
                start:1,
                end:20
            }
        })
        if(data.status===200 && data.body.count !== 0){
            Toast.info(`总计${data.body.count}条数据`,2)
            this.setState({
                list:data.body.list,
                count:data.body.count,
                isLoaded:true
            })
        }else{
            return data
        }
    }
    isRowLoaded=({index})=>{
        //当前索引有数据则返回true，反正为false,综合条件InfiniteLoader会触发loadMoreRows
        return !!this.state.list[index]
    }
    // 加载更多数据
    loadMoreRows=({ startIndex, stopIndex })=>{
        return new Promise((resovle,reject)=>{
            API.get('/houses',{
                params:{
                    cityId:this.state.currentCity.value,
                    ...this.filters,
                    start:startIndex,
                    end:stopIndex
                }
            }).then((data)=>{
                if(data.status===200){
                    this.setState({
                        list:[...this.state.list,...data.body.list]
                    })
                    resovle()
                }else{
                    return data
                }
            })
        })
    }
    // 渲染列表页
    renderList=()=>{
        let {count,isLoaded} = this.state
        if(count){// 如果有数据直接渲染
            return (
            <InfiniteLoader
            isRowLoaded={this.isRowLoaded}//判断是否加载完数据，布尔值
            loadMoreRows={this.loadMoreRows}//加载更多
            rowCount={count} //总条数
            >
            {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer>
                    {({width})=> (
                        <List
                            ref={registerChild} //
                            onRowsRendered={onRowsRendered} //当用户滚动页面时通知加载程序
                            autoHeight //WindowScroller必须写，自适应窗口高度
                            isScrolling={isScrolling} //是否正在滚动
                            onScroll={onChildScroll} //滚动事件
                            scrollTop={scrollTop} // 滚动出去的距离
                            height={height}
                            width={width}
                            rowCount={count}// 总条数
                            rowHeight={120}
                            rowRenderer={this.rowRenderer}
                        />
                    )}
                </AutoSizer>
            )}
            </WindowScroller>
            )}
        </InfiniteLoader>
        )    

            // 如果已经请求完了，并且没有数据，提示
        }else if(isLoaded===true && count===0 ){
            return <NoHouse>
                没有找到符合条件的房子，换个条件再搜索一次吧！
            </NoHouse>
        }else{
            return null
        }
    }
    render(){
        return <div className={styles.houselist}>
            
            <Spring
                from = {{opacity:0}}
                to={{opacity:1}}>
                {
                (props)=>{
                return <div style={props} className={styles.header}>
                <i className="iconfont icon-back"></i>
                    <SearchHeader cityName={ this.state.currentCity}></SearchHeader>
                </div>
                }
                }
            </Spring>
            <Ceiling height={40}>
                <Filter onFilters={this.onFilters}></Filter>
            </Ceiling>
            {/* 渲染租房数据列表 */}
            {this.renderList()}
        </div>
    }
}