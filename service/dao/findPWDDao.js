// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
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
// 用户数据库答案
var DBanswer
module.exports = {
  
    // 查找用户密保问题
  findQuestion: function (req, res, next) {
    var $params = req.body.params
    // 打印一下前端的数据
    // 对密码加密
    var username = $params.username 
    pool.getConnection(function (err, connection) {
      if (err) {
        throw new Error('注册用户连接池出错')
      }
      connection.query($sql.findPWD.findQuestion, username, function (err, result) {
        if (err) {
            throw new Error('找回密码寻找问题出错')
        }
        userquestion = JSON.stringify(result)
        DBanswer = 
        result = {
            code: '0',
            data: findquestion,
            msg: '查找成功'
          }
          jsonWrite(res, result)
          connection.release()
      })
    })
  },
  changePWD: function (req, res, next) {
    var $params = req.body.params
    // 打印一下前端的数据
    // console.log($params)
    // 对密码加密
    if ($params.newpassword===''||$params.newpassword!==$params.doublenewpassword) {
        var result = {
            code:'1',
            data: {},
            msg: '密码不一致,请修改'
        }
        jsonWrite(res, result)
        return ;
    }
    if($params.answer===''||$params.answer!==DBanswer){
        var result = {
            code:'1',
            data: {},
            msg: '密保问题错误'
        }
        jsonWrite(res, result)
        return ;
    }
    $params.username = $params.username
    $params.newpassword = bcryptFun.bcryptInfo($params.newpassword)
    pool.getConnection(function (err, connection) {
        if (err) {
          throw new Error('找回密码用户连接池出错')
        }
        connection.query($sql.findPWD.changPWD, [newpassword, username], function (err, result) {
          if (err) {
              throw new Error('找回密码插入新密码出错')
          }
          findquestion = JSON.stringify(result)
          result = {
              code: '0',
              data: {},
              msg: '密码修改成功'
            }
            jsonWrite(res, result)
            connection.release()
        })
      })
  }
}
