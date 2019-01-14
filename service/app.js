const express = require('express')
const app = express()
const registeruser = require('./routes/registerUser')
const findpwd = require('./routes/findPWD')
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
/* 以下路由 */
// 注册用户
app.use('/api/user', registeruser)
// 找回密码
app.use('/api/findPWD/findQuestion',findpwd)
