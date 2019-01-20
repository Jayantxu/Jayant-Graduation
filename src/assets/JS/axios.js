/*
* @author Jayant
* @date 2019-1-17
* @description axios的公共处理方法
*/
import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:3000'
// 统一对请求进行拦截器处理*-*-*主要处理未登录状态问题
axios.interceptors.request.use((config) => {
  // 检查未登录->可以考虑store中存一个标识,检验标识
  return config
}, (err) => {
  let res = {}
  if (err) {
    res = {
      err: err,
      data: {
        code: '1',
        msg: ` 用户未登录,请您先登录`
      }
    }
  }
  // 对请求错误后进行处理
  return Promise.resolve(res)
})
// 统一对响应进行拦截器处理*-*-*主要处理状态不通问题
axios.interceptors.response.use(function (response) {
  return response
}, function (err) {
  var res = {}
  // 识别不同状态码，并返回数据
  if (err.response.status === 404) {
    res = {
      data: {
        code: '1',
        msg: '404, 服务器出错'
      }
    }
  }
  console.log(err)
  return Promise.resolve(res)
}
)
export default axios
