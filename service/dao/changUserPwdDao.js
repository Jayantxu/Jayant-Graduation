// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入密码加密处理方法
var bcryptFun = require('../public/crypto')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
// 寻找用户密码答案
var finduserQuestion = function (username, answer, userchangeAbout) {
  var finduserquestionPromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        console.log('个人中心用户修改密码获取用户数据库答案连接错误')
        reject(result)
      }
      var str = ''
      if (userchangeAbout) {
        str = $sql.findPWD.findQuestion
      } else {
        // 对密码加密
        answer = bcryptFun.bcryptInfo(answer)
        str = $sql.login.loginIn
      }
      connection.query(str, username, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心用户修改密码获取用户数据库答案语句错误')
          pool.releaseConnection(connection)
          reject(result)
        } else {
          // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
          result = sqlformatJSON.transforms(result)
          var SQLanswer
          if (userchangeAbout) {
            SQLanswer = result[0].answer
          } else {
            SQLanswer = result[0].password
          }
          if (answer === SQLanswer) {
            pool.releaseConnection(connection)
            resolve()
          } else {
            result = {
              code: '1',
              data: {
              },
              msg: '密保或旧密码错误，请重新输入'
            }
            console.log('个人中心用户修改密码密保错误')
            pool.releaseConnection(connection)
            reject(result)
          }
        }
      })
    })
  })
  return finduserquestionPromise
}
var changeuserPWD = function (username, password) {
  var changeuserPWDPromise = new Promise(function (resolve, reject) {
    // 对密码加密
    password = bcryptFun.bcryptInfo(password)
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        console.log('个人中心用户修改密码数据库连接错误')
        reject(result)
      }
      connection.query($sql.findPWD.changPWD, [password, username], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心用户修改密码语句错误')
          pool.releaseConnection(connection)
          reject(result)
        } else {
          result = {
            code: '0',
            data: {
            },
            msg: '修改密码成功，系统将自动登出你的账号'
          }
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return changeuserPWDPromise
}
// 修改用户密保
var changeUserQUANCode = function (username, usernewQU, usernewAN) {
  var changeUserQUANCodePromise = new Promise(function (resolve, reject) {
    // 对密码加密
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        console.log('个人中心用户修改密保数据库连接错误')
        reject(result)
      }
      connection.query($sql.userCenter.changUserQuestionAnswer, [usernewQU, usernewAN, username], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心用户修改密保数据库连接错误')
          pool.releaseConnection(connection)
          reject(result)
        } else {
          result = {
            code: '0',
            data: {
            },
            msg: '用户修改密保成功'
          }
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return changeUserQUANCodePromise
}
module.exports = {
  // 权限配置中心-修改用户权限
  changePwd: function (req, res, next) {
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
      jsonWrite.jsonWrite(res, result)
    } else {
      var userchangeAbout = $params.userchangeAbout
      var username = $params.username
      var usernewpassWD = $params.usernewpassWD
      // 如果是true那么是根据密保修改的，如果是false是根据旧密码
      var changeReson
      if (userchangeAbout) {
        changeReson = $params.useranswer
      } else {
        changeReson = $params.useroldpassWD
      }
      finduserQuestion(username, changeReson, userchangeAbout)
        .then((json) => {
          return changeuserPWD(username, usernewpassWD)
        })
        .then((json) => {
          // 清除token
          res.clearCookie('token')
          jsonWrite.jsonWrite(res, json)
        })
        .catch((err) => {
          jsonWrite.jsonWrite(res, err)
        })
    }
  },
  changeQUES: function (req, res, next) {
    var result = {}
    var $token = req.cookies.token
    var $params = req.body.params
    if (!$token) {
      result = {
        // 40表未登录
        code: '40',
        data: {
        },
        msg: '用户未登录'
      }
      jsonWrite.jsonWrite(res, result)
    } else {
      var username = $params.username
      var usernewQU = $params.newQU
      var usernewAN = $params.newAN
      var useroldAN = $params.oldAN
      // 去寻找用户密保答案是否正确
      finduserQuestion(username, useroldAN, true)
        .then((json) => {
          return changeUserQUANCode(username, usernewQU, usernewAN)
        })
        .then((json) => {
          jsonWrite.jsonWrite(res, json)
        })
        .catch((err) => {
          jsonWrite.jsonWrite(res, err)
        })
    }
  }
}
