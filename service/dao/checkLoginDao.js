// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入token方法
var tokenFun = require('../public/Token')
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
  checkLogin: function (req, res, next) {
    var result = {}
    var $token = req.cookies.token
    // 获取用户传递参数
    var $params = req.body.params
    if (!$token) {
      result = {
        // 40表未登录
        code: '40',
        data: {
        },
        msg: '用户未登录'
      }
      jsonWrite(res, result)
    } else {
      var $Xtoken = tokenFun.decodeToken($token, $params.username)
      if (!$Xtoken.bool) {
        // 用户名与token信息不一致的情况
        result = {
          code: '30',
          data: {
          },
          msg: 'cookie与用户不一致'
        }
        res.clearCookie('token')
        jsonWrite(res, result)
      } else {
        result = {
          code: '0',
          data: {
          },
          msg: '用户已登录'
        }
        jsonWrite(res, result)
      }
    }
  }
}
