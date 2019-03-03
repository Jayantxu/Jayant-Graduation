// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var changeTime = require('../public/changeTime')
var checkPermisson = require('../public/checkPermisson')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
var commitNewAnnoun = function (username, anno) {
  var commitNewAnnounpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        console.log(`提交新公告数据库错误---commitNewAnnoun---error`)
      }
      var AnnounceData = changeTime.toSqlTime()
      connection.query($sql.aboutAnnounce.commit, [anno, AnnounceData, username], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '提交新公告出错'
          }
          pool.releaseConnection(connection)
          console.log('提交新公告数据库错误---数据库语句错误----')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          resolve()
        }
      })
    })
  })
  return commitNewAnnounpromise
}
var getNowA = function () {
  var getNowApromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        console.log(`获取最新公告数据库错误---getNowA---error`)
      }
      connection.query($sql.aboutAnnounce.getNowA, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '获取新公告出错'
          }
          pool.releaseConnection(connection)
          console.log('获取最新公告数据库错误---数据库语句错误----')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          result = sqlformatJSON.transforms(result)
          resolve(result)
        }
      })
    })
  })
  return getNowApromise
}
module.exports = {
  commitnewA: function (req, res, next) {
    // 获取用户传递参数
    var $params = req.body.params
    checkPermisson.checkUserPermission($params.username)
      .then((json) => {
        var permiss = json.permission
        if (permiss !== '2') {
          var result = {
            code: '1',
            msg: '用户权限不足'
          }
          return Promise.reject(result)
        } else {
          commitNewAnnoun($params.username, $params.announce) 
        }
      })
      .then((tjson) => {
        var result = {
          code: '0',
          data: {
          },
          msg: '成功更新公告'
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        jsonWrite.jsonWrite(res, err)
      })
  },
  getNowA: function (req, res, next) {
    getNowA()
      .then((tjson) => {
        var result = {
          code: '0',
          data: {
            anno: tjson
          },
          msg: '成功更新公告'
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        jsonWrite.jsonWrite(res, err)
      })
  }
}
