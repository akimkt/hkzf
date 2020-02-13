import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'
import { API } from '../../../utils/api'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: '',
        id: ''
      },
      // 价格
      price: '',
      // 面积
      size: 0,
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }
  componentWillMount(){
    this.getCommunity()
  }
  // 如果跳转有携带参数state，说明已选择小区，赋值显示
  getCommunity(){
    let {state} = this.props.location
    if(state){
      this.setState({
        community: {
          name: state.communityName,
          id: state.community
        },
      })
    }
  }
  // 用户填写或选择信息触发
  handleChange=(name,value)=>{
    this.setState({
      [name]:value
    })
  }
  // 选择图片 ImagePicker原理是原生js的FileReader，获取到的value是[{url,file},{}]
  showImages=(files,type,index)=>{
      //type可以是add 或remove
    // 设置临时图片展示
    this.setState({
      tempSlides:files
    })
  }
  // housePackage组件触发传值过来 存储配置选项数据 发请求用
  handleSelect=(newlist)=>{
    this.setState({
      supporting:newlist.join('|')
    })
  }
  // 取消时跳转回上一页
  onCancel=()=>{
    this.props.history.go(-1)
  }
  // 提交房屋信息时
  addHouse= async ()=>{
    
    let {title, description, oriented, supporting, price, roomType, size, floor, community:{id:xiaoqu},tempSlides}=this.state
    // 校验填写是否正确和完整
    let isOk = (title.length && description.length && oriented.length && supporting.length && price.length && roomType.length && size.length && floor.length && xiaoqu.length )
    if(!isOk){
    //  return Toast.info('请填写完整',1)
    }
    if(!tempSlides.length){
      return Toast.info('请上传图片',1)
    }
    // 如果选择了图片
    // 发送请求上传图片 获取图片数据
      let fd = new FormData()
      tempSlides.forEach(item=>fd.append('file',item.file))
      let houseimgs = await API.post('/houses/image',fd,{'Content-Type':'multipart/form-data'})
      //上传成功，存储房屋图片路径信息
      if(!houseimgs.status===200){
        return Toast.fail('上传失败',1)
      }
    // 发送请求添加房屋
    let res = await API.post('/user/houses',{
      title,
      description,
      "houseImg":houseimgs.body.join('|'),
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      "community": xiaoqu
    })
    if(res.status===200){
      Toast.success('发布成功',1)
      this.props.history.push('/rent')
    }
  }
  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem 
            placeholder="请输入租金/月" 
            extra="￥/月" 
            value={price} 
            onChange={(value)=>{ this.handleChange('price',value)}}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡"
            value={size}
            onChange={(value)=>{ this.handleChange('size',value)}}
          >
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} cols={1}
            onChange={(value)=>{ this.handleChange('roomType',value[0])}}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} cols={1}
          onChange={(value)=>{ this.handleChange('floor',value[0])}}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} cols={1}
          onChange={(value)=>{ this.handleChange('oriented',value[0])}}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(value)=>{ this.handleChange('title',value)}}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={(value)=>{ this.showImages(value)}}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge select onSelect={this.handleSelect}/>
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(value)=>{ this.handleChange('description',value)}}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
