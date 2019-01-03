// const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const registeruser = require('./api/registerUser')
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded())

app.use('/api/registerUser', registeruser)

//  定义服务启动端口
app.listen(3000, () => {
  console.log('app listening on port 3000.')
})
