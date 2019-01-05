// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}
module.exports = {
  add: function (req, res, next) {
    var result = {
      name: 'aaa',
      pwd: '123'
    }
    jsonWrite(res, result)
  }
}
