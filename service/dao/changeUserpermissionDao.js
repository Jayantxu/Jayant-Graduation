// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
var checkPermisson = require('../public/checkPermisson')
var checkUserAnswer = require('../public/checkUserAnswer')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
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
// 权限配置中心-修改用户权限2
var changepermission2 = function (cutusername, newpermission) {
  var promise2 = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        err = '修改用户权限数据库连接错误'
        reject(result, err)
      }
      connection.query($sql.userCenter.changeuserpermission, [newpermission, cutusername], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          err = '修改用户权限数据库语句错误'
          pool.releaseConnection(connection)
          reject(result)
        } else {
          // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
          result = sqlformatJSON.transforms(result)
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return promise2
}
// 权限配置中心-重置用户密保2
var changeuserAnswer2 = function (cutusername) {
  var promise2 = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        err = '重置用户密保数据库连接错误'
        reject(result, err)
      }
      connection.query($sql.userCenter.changeuserAnswer, ['888888', cutusername], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          err = '重置用户密保数据库语句错误'
          pool.releaseConnection(connection)
          reject(result)
        } else {
          // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
          result = sqlformatJSON.transforms(result)
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return promise2
}
// 删除用户正式步骤
var deleteUser2 = function (cutusername) {
  var deleteUserpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        console.log('删除用户数据库连接错误')
        reject(result)
      }
      connection.query($sql.userCenter.deleteUser, cutusername, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('删除用户数据库语句错误')
          pool.releaseConnection(connection)
          reject(result)
        } else {
          result = sqlformatJSON.transforms(result)
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return deleteUserpromise
}
module.exports = {
  // 权限配置中心-修改用户权限
  changepermission: function (req, res, next) {
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
      var cutusername = $params.cutusername
      var newpermission = ($params.oldpermission === '0' ? '1' : '0')
      var username = $params.username
      // console.log(newpermission)
      checkPermisson.checkUserPermission(username)
        .then((json) => {
          var permiss = json.permission
          if (permiss !== '2') {
            result = {
              code: '1',
              msg: '用户权限不足'
            }
            return Promise.reject(result)
          } else {
            // changePermission的方法2
            return changepermission2(cutusername, newpermission)
          }
        })
        .then((json) => {
          result = {
            code: '0',
            data: {
              cutusername: cutusername
            },
            msg: '用户修改成功'
          }
          jsonWrite(res, result)
        })
        .catch((result, err) => {
          jsonWrite(res, result)
          throw new Error(err)
        })
    }
  },
  // 权限配置中心-重置用户密保
  changeuserAnswer: function (req, res, next) {
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
      var cutusername = $params.cutusername
      var username = $params.username
      // console.log(newpermission)
      checkPermisson.checkUserPermission(username)
        .then((json) => {
          var permiss = json.permission
          if (permiss !== '2') {
            result = {
              code: '1',
              msg: '用户权限不足'
            }
            return Promise.reject(result)
          } else {
            // changePermission的方法2
            return changeuserAnswer2(cutusername)
          }
        })
        .then((json) => {
          result = {
            code: '0',
            data: {
              cutusername: cutusername
            },
            msg: '用户密保重置成功'
          }
          jsonWrite(res, result)
        })
        .catch((result, err) => {
          jsonWrite(res, result)
          throw new Error(err)
        })
    }
  },
  deleteUser: function (req, res, next) {
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
      var cutusername = $params.cutusername
      var username = $params.username
      var answer = $params.answer
      // console.log(newpermission)
      checkPermisson.checkUserPermission(username)
        .then((json) => {
          var permiss = json.permission
          if (permiss !== '2') {
            result = {
              code: '1',
              msg: '用户权限不足'
            }
            return Promise.reject(result)
          } else {
            // 寻找用户答案的公共方法
            return checkUserAnswer.checkUserAnswerCoomon(username, answer)
          }
        })
        .then((data) => {
          if (data === '1') {
            return deleteUser2(cutusername)
          } else {
            result = {
              code: '1',
              data: {
              },
              msg: '未知错误'
            }
            console.log('删除用户未知错误')
            return Promise.reject(result)
          }
        })
        .then((json) => {
          result = {
            code: '0',
            data: {
            },
            msg: '删除用户成功,后台陆续为你删除用户的文章等信息'
          }
          jsonWrite(res, result)
        })
        .catch((result) => {
          jsonWrite(res, result)
        })
    }
  }
}
