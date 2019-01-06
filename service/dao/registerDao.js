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
    var $params = req.body.params
    // 打印一下前端的数据
    // console.log($params)
    pool.getConnection(function (err, connection) {
      if (err) {
        throw new Error('注册用户连接池出错')
      }
      connection.query($sql.user.registerQuery, $params.username, function (err, result) {
        if (err) {
          throw new Error('注册用户sql查询语句出错')
        }
        result = JSON.stringify(result)
        var $hasuser = JSON.parse(result).length
        if ($hasuser > 0) {
          result = {
            code: '0',
            msg: '用户已存在，请更换用户名'
          }
          jsonWrite(res, result)
          connection.release()
        } else {
          connection.query($sql.user.registerAdd, [$params.username, $params.password, $params.question, $params.answer], function (err, result) {
            if (err) {
              throw new Error('注册用户插入语句出错')
            }
            result = {
              code: '0',
              msg: '用户注册成功'
            }
            jsonWrite(res, result)
            connection.release()
          })
        }
      })
    })
  }
}
