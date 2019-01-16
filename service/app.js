const express = require('express')
const app = express()
const userPlay = require('./routes/userPlay')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
//  设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  // 注意下方的 * 是可影响返回数据的同源问题
  res.header('Access-Control-Allow-Origin', '*')
  //  Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
//  定义服务启动端口
app.listen(3000, () => {
  console.log('app listening on port 3000.')
})
/* 以下路由,大模块的路由 */
// 用户相关性
app.use('/api/user', userPlay)
