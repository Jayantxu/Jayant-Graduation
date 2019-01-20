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
module.exports = {
  loginIn: function (req, res, next) {
    // 获取用户传递参数
    var $params = req.body.params
    // 先对密码加密,在进行对比
    $params.password = bcryptFun.bcryptInfo($params.password)
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
          connection.release()
          throw new Error('用户登录查询语句出错')
        } else {
          // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
          result = sqlformatJSON.transforms(result)
          var SQLpassword = result[0].password
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
                Ctoken: Ctoken.token
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
          connection.release()
        }
      })
    })
  }
}
