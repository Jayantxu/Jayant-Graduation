// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
var checkPermisson = require('../public/checkPermisson')
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
var getAlluserTotalPromise = function (username) {
  var promise2 = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        err = '权限配置中心获取所有用户出错'
        reject(err)
      }
      var result = {}
      connection.query($sql.userCenter.getuserTotal, [username], (err, result) => {
        if (err) {
          result = {
            permission: 'err',
            msg: '权限中心获取用户总数数据库语句错误'
          }
          connection.release()
          reject(result)
        } else {
          // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
          result = sqlformatJSON.transforms(result)
          resolve(result)
        }
      })
    })
  })
  return promise2
}
var getAlluserPromise = function (nowPage, username) {
  var promise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        err = '权限配置中心获取所有用户出错'
        reject(err)
      }
      var result = {}
      var sqlPage = (nowPage - 1) * 10
      connection.query($sql.userCenter.getallUser, [username, sqlPage], (err, result) => {
        if (err) {
          result = {
            permission: 'err',
            msg: '权限中心获取用户数据库语句错误'
          }
          connection.release()
          reject(result)
        } else {
          // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
          result = sqlformatJSON.transforms(result)
          resolve(result)
        }
      })
    })
  })
  return promise
}

module.exports = {
  findAllUser: function (req, res, next) {
    var result = {}
    var $token = req.cookies.token
    // 获取用户传递参数
    var $params = req.body.params
    var TotalUser = 0
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
      var nowPage = $params.page
      var username = $params.username
      checkPermisson.checkUserPermission(username)
        .then((json) => {
          var permiss = json.permission
          if (permiss !== 2) {
            var err = '用户权限不足'
            Promise.reject(err)
          } else {
            return getAlluserTotalPromise(username)
          }
        })
        .then((json) => {
          TotalUser = json[0].numT
          return getAlluserPromise(nowPage, username)
        })
        .then((json) => {
          // console.log(json)
          result = {
            code: '0',
            data: {
              Total: TotalUser,
              data: json
            },
            msg: '用户查询成功'
          }
          jsonWrite(res, result)
        })
        .catch((err) => {
          result = {
            code: '1',
            data: {
            },
            msg: err
          }
          jsonWrite(res, result)
          console.log(err)
        })
    }
  }
}
