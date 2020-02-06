
import {API} from './api'
// 定位当前城市
export let getCurrentCity = ()=>{
    // 尝试获取本地数据（当前定位）
    let currentCity = JSON.parse(window.localStorage.getItem('currentCity'))
    if(currentCity){// 如果获取到数据 Promise简写返回
        return Promise.resolve(currentCity)
    }else{// 如果本地没有数据，发请求获取数据  因为是异步的，所以封装promise
      return new Promise((resolve,reject)=>{
            // 创建实例 获取当前城市名
            var myCity = new window.BMap.LocalCity();
            myCity.get( async (result)=>{
                var cityName = result.name;
                // 利用当前城市名请求获取后端提供的城市信息
               let data = await API.get('/area/info?name='+cityName)
                //存入本地并返回
               localStorage.setItem('currentCity',JSON.stringify(data.body))
               resolve(data.body)
            })
        })

    }
}