import React from 'react'
import PropTypes from 'prop-types'// 验证默认值
import { BASE_URL } from '../../utils/url'// 网站文件根url
import styles from './index.module.css'
console.log(PropTypes)
const NoHouse = ({ children }) => (
  
  <div className={styles.root}>
    <img
      className={styles.img}
      src={BASE_URL + '/img/not-found.png'}
      alt="暂无数据"
    />
    <p className={styles.msg}>{children}</p>
  </div>
)

// 校验父组件传递的数据
NoHouse.propTypes = {
  children: PropTypes.node.isRequired
}

export default NoHouse
