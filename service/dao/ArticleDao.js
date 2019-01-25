// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入token方法
var tokenFun = require('../public/Token')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
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
  commitNewArticle: function (req, res, next) {
    var $params = req.body.params
    var result = {}
    var $token = req.cookies.token
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
          // 40表未登录
          code: '50',
          data: {
          },
          msg: '未知错误'
        }
        jsonWrite(res, result)
      } else {
        pool.getConnection(function (err, connection) {
          if (err) {
            throw new Error ('用户新文章数据库连接出错')
          }
          connection.query($sql.article., [], (err, result) => {
            if (err) {
              result = {
                code: '1',
                msg: '服务器出错'
              }
              jsonWrite(res, result)
              connection.release()
              throw new Error('用户登录查询语句出错')
            } else {
              result = sqlformatJSON.transforms(result)
              console.log(result)
            }
          })
        })
      }
    }
  }
}
