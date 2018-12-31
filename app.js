//  引入express模块
const express = require('express')
//  创建app对象
const app = express()
const hero = require('./router/hero')
const mongoose = require('mongoose')
//  定义简单路由
app.use('/', hero)
mongoose.connect('mongodb://localhost:27017/Graduation')
//  定义服务启动端口
app.listen(3000, () => {
  console.log('app listening on port 3000.')
})
