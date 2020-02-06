import React from 'react'
import PropTypes from 'prop-types';

class Ceiling extends React.Component{
    pRef = React.createRef()
    cRef = React.createRef()
    
    componentDidMount(){
        window.addEventListener('scroll',this.handleScroll)
    }
    // 窗口滚动事件的回调函数,
    handleScroll=()=>{
        let pDiv =this.pRef.current
        let cDiv =this.cRef.current
        // 如果占位标签的距离窗口顶部高度小于等于0
        if(pDiv.getBoundingClientRect().top<=0){
            // 设置内容组件固定定位,给占位标签一个高度
            cDiv.style='position:fixed;width:100%;z-index:10;top:0'
            pDiv.style.height=this.props.height+'px'
        }
        else{
            // 否则 内容组件相对定位 占位标签高度清零
            cDiv.style='position:relative'
            pDiv.style.height=0
        }
    }
    // 组件卸载前清除监听滚动
    componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll)
    }
    render(){
        return <>
        {/* 占位符 两大作用：
            1.判断吸顶组件距离顶部的高度而不是直接操作filter组件，
            2.当filter固定定位时，设置高度实现占位，避免下方标签突然上跳
        */}
        <div className="placeholder" ref={this.pRef}></div>
        {/* 吸顶组件包裹的内容 */}
        <div ref={this.cRef} className="content">
            {this.props.children}
        </div>
        
    </>
    }

}
Ceiling.propTypes = {
    children: PropTypes.node.isRequired
}
export default Ceiling