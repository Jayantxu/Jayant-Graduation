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
module.exports = {
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
  }
}
