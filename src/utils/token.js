export const getToken=()=>{
    return window.localStorage.getItem('hkzftoken') ||''
}
export const setToken=(val)=>{
    return window.localStorage.setItem('hkzftoken',val)
}
export const removeToken = ()=>{
    return window.localStorage.removeItem('hkzftoken')
}
export const isAuth=()=>{
    return !!getToken()
}