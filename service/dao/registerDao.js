// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
var changeTime = require('../public/changeTime')
var login = require('../dao/loginUserDao')
// 引入加解密处理方法
var bcryptFun = require('../public/crypto')
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
    // 对密码加密
    $params.password = bcryptFun.bcryptInfo($params.password)
    var registerData = changeTime.toSqlTime2()
    pool.getConnection(function (err, connection) {
      if (err) {
        throw new Error('注册用户连接池出错')
      }
      connection.query($sql.register.registerQuery, $params.username, function (err, result) {
        if (err) {
          throw new Error('注册用户sql查询语句出错')
        }
        result = JSON.stringify(result)
        var $hasuser = JSON.parse(result).length
        if ($hasuser > 0) {
          result = {
            code: '1',
            msg: '用户已存在，请更换用户名'
          }
          jsonWrite(res, result)
          pool.releaseConnection(connection)
        } else {
          connection.query($sql.register.registerAdd, [$params.username, $params.password, $params.question, $params.answer, registerData], function (err, result) {
            if (err) {
              throw new Error('注册用户插入语句出错')
            }
            result = {
              code: '0',
              msg: '用户注册成功'
            }
            jsonWrite(res, result)
            pool.releaseConnection(connection)
          })
        }
      })
    })
  },
  checkIs: function (req, res, next) {
    // 获取用户传递参数
    var $params = req.body.params
    var result
    login.checkUserExist($params.username)
      .then((json) => {
        // 用户名存在--不能执行注册
        result = {
          code: '1',
          msg: '用户已存在，请更换用户名'
        }
        jsonWrite(res, result)
      })
      .catch((err) => {
        // 用户名不存在--可以注册
        result = {
          code: '0',
          msg: '用户可注册'
        }
        jsonWrite(res, result)
        console.log(`注册:${err}`)
      })
  }
}
