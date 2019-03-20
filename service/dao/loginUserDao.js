// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入加解密处理方法
var bcryptFun = require('../public/crypto')
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
var userExist = function (username) {
  var userExistpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(`查找用户是否存在连接错误---userExist---error`)
        var s = '服务器出错'
        reject(s)
      }
      connection.query($sql.login.findUserExist, username, (err, result) => {
        var s
        if (err) {
          pool.releaseConnection(connection)
          s = '用户名不存在'
          reject(s)
        } else {
          result = sqlformatJSON.transforms(result)
          if (result[0].num === 0) {
            pool.releaseConnection(connection)
            s = '用户名不存在'
            reject(s)
          } else {
            pool.releaseConnection(connection)
            s = '用户名存在'
            resolve(s)
          }
        }
      })
    })
  })
  return userExistpromise
}
module.exports = {
  loginIn: function (req, res, next) {
    // 获取用户传递参数
    var $params = req.body.params
    // 先对密码加密,在进行对比
    $params.password = bcryptFun.bcryptInfo($params.password)
    userExist($params.username)
      .then((json) => {
        pool.getConnection(function (err, connection) {
          if (err) {
            throw new Error('用户登录数据库连接出错')
          }
          connection.query($sql.login.loginIn, $params.username, (err, result) => {
            if (err) {
              result = {
                code: '1',
                msg: '服务器出错'
              }
              jsonWrite(res, result)
              pool.releaseConnection(connection)
            } else {
              // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
              result = sqlformatJSON.transforms(result)
              var SQLpassword = result[0].password
              var usermeta = result[0].permission
              // console.log(result[0].password)
              if ($params.password !== SQLpassword) {
                result = {
                  code: '1',
                  data: {},
                  msg: '密码不正确'
                }
              } else {
                // 生成token
                var Ctoken = tokenFun.createToken($params.username)
                // console.log(Ctoken.token)
                result = {
                  code: '0',
                  data: {
                    username: $params.username,
                    Ctoken: Ctoken.token,
                    meta: usermeta
                  },
                  msg: '登录成功'
                }
                // 设置cookie
                res.cookie('token', Ctoken.token, {
                  expiress: 0,
                  httpOnly: true
                })
              }
              jsonWrite(res, result)
              pool.releaseConnection(connection)
            }
          })
        })
      })
      .catch((err) => {
        var result = {
          code: '1',
          msg: err
        }
        jsonWrite(res, result)
      })
  },
  loginOut: function (req, res, next) {
    res.clearCookie('token')
    var result = {
      code: '0',
      data: {
      },
      msg: '登出成功'
    }
    jsonWrite(res, result)
  },
  checkUserExist: userExist
}
