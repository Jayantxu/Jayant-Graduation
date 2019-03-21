const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const userPlay = require('./routes/userPlay')
const articleChange = require('./routes/articleChange')
const userCenter = require('./routes/userCenter')
const bookControl = require('./routes/bookControl')
const downloadFile = require('./routes/downloadFile')
const mainBook = require('./routes/mainBook')
const hotnewBook = require('./routes/hotnewBook')
const BookCommon = require('./routes/BookCommon')
const bodyParser = require('body-parser')
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
//  设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  // 注意下方的 * 是可影响返回数据的同源问题-*-*-*-*-在.vue中发送cookie时,需要更改下方Allow-Origin为具体的域名
  res.header('Access-Control-Allow-Origin', 'http://localhost:8001')
  //  Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
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
// 文章相关
app.use('/api/article', articleChange)
// 用户中心
app.use('/api/userCenter', userCenter)
// 继续编辑
app.use('/api/aboutbook', bookControl)
// 文件下载
app.use('/api/download', downloadFile)
// 首页书籍
app.use('/api/main', mainBook)
// 首页加载热门、新书
app.use('/api/hotNewBook', hotnewBook)
// 一些公共方法
app.use('/api/common', BookCommon)
