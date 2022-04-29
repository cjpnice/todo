import Axios from 'axios'
const axios = Axios.create({
  timeout: 60000, // 超时
  baseURL: 'http://localhost/api/' // 调试地址
  // baseURL: 'http://suepai.com.cn/api/' // 部署地址
})

// 请求拦截
axios.interceptors.request.use(req => {
  if (req.method === 'get') {
    const url = req.url
    const t = new Date().getTime()
    if (url.indexOf('?') >= 0) {
      req.url = `${url}&t=${t}`
    } else {
      req.url = `${url}?t=${t}`
    }
  }
  return req
})

// 响应拦截
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 响应失败统一处理
    const { response } = error
    if (response) {
      switch (response.status) {
        case 400:
          window.$vm.$message.error('请求无效')
          break
        case 403:
          window.$vm.$message.error('您没有权限这样做，请联系管理员')
          break
        case 404:
          window.$vm.$message.error('请求未找到')
          break
        case 500:
          window.$vm.$message.error('系统异常')
          break
        case 504:
          window.$vm.$message.error('请求超时，请稍后再试')
          break
        default:
          window.$vm.$message.error('系统异常')
          break
      }
    }
    return Promise.reject(error)
  }
)
export default axios
