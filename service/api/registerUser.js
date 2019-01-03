var models = require('../db/db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../db/sqlMap')
var conn = mysql.createConnection(models.mysql)
conn.connect()
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.send('err')
  } else {
    console.log(ret)
    res.send(ret)
  }
}
var dateStr = function (str) {
  return new Date(str.slice(0, 7))
}
//  注册用户接口
router.post('/registeruser', (req, res) => {
  var sql = $sql.user.add
  var params = req.body
  //  请求参数
  console.log(params)
  conn.query(sql, [params.username, params.password, params.question, params.answer, 1], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
module.exports = router
