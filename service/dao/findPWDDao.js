// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入加解密处理方法
var bcryptFun = require('../public/crypto')
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
// 用户数据库答案--findQuestion中寻找
var DBanswer
module.exports = {
  // 查找用户密保问题
  findQuestion: function (req, res, next) {
    var $params = req.query
    // 打印一下前端的数据
    // 对密码加密
    // console.log(req.query)
    var username = $params.username
    if (username === '') {
      var result = {
        code: '1',
        data: '',
        msg: '用户名不正确'
      }
      jsonWrite(res, result)
    }
    pool.getConnection(function (err, connection) {
      if (err) {
        throw new Error('注册用户连接池出错')
      }
      connection.query($sql.findPWD.findQuestion, username, function (err, result) {
        if (err) {
          result = {
            code: '1',
            data: '',
            msg: '服务器出错'
          }
          // 如果出错,关闭连接并返回错误
          jsonWrite(res, result)
          connection.release()
          throw new Error('找回密码寻找问题出错')
        }
        // console.log(JSON.stringify(result))
        // 将查询出来的结果转为数组，然后再取JSON
        var toJSON = sqlformatJSON.transforms(result)
        // 记录下来答案
        DBanswer = toJSON[0].answer
        // console.log(toJSON[0].question)
        result = {
          code: '0',
          data: toJSON[0].question,
          msg: '查找成功'
        }
        jsonWrite(res, result)
        connection.release()
      })
    })
  },
  changePWD: function (req, res, next) {
    var $params = req.body.params
    var result
    // 打印一下前端的数据
    // console.log($params)
    // 对密码加密
    if ($params.answer === '' || $params.answer !== DBanswer) {
      result = {
        code: '1',
        data: {},
        msg: '密保问题错误，请刷新重试！'
      }
      jsonWrite(res, result)
      return
    }
    $params.username = $params.username
    // console.log($params.newpassword)
    $params.newpassword = bcryptFun.bcryptInfo($params.newpassword)
    pool.getConnection(function (err, connection) {
      if (err) {
        result = {
          code: '1',
          data: '',
          msg: '服务器出错'
        }
        // 如果出错,关闭连接并返回错误
        jsonWrite(res, result)
        connection.release()
        throw new Error('找回密码用户连接池出错')
      }
      connection.query($sql.findPWD.changPWD, [$params.newpassword, $params.username], function (err, result) {
        if (err) {
          result = {
            code: '1',
            data: '',
            msg: '密码修改出错，请稍后再试'
          }
          // 如果出错,关闭连接并返回错误
          jsonWrite(res, result)
          connection.release()
          throw new Error('找回密码插入新密码出错')
        } else {
          // var toJSON = sqlformatJSON.transforms(result)
          // console.log(toJSON)
          result = {
            code: '0',
            data: {
              username: $params.username
            },
            msg: '密码修改成功,将自动跳转首页！'
          }
          jsonWrite(res, result)
          connection.release()
        }
      })
    })
  }
}
