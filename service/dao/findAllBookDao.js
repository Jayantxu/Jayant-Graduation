// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var checkPermisson = require('../public/checkPermisson')
var getBook = require('../public/getBook')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
module.exports = {
  findAllBook: function (req, res, next) {
    var result = {}
    var $token = req.cookies.token
    var $params = req.body.params
    var totalBookNum
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
      var nowPage = $params.nowpage
      // 去寻找用户密保答案是否正确
      checkPermisson.checkUserPermission(username)
        .then((json) => {
          var permiss = json.permission
          // console.log(permiss !== '2' && permiss !== '1')
          if (permiss !== '2' && permiss !== '1') {
            result = {
              code: '1',
              msg: '用户权限不足'
            }
            console.log('查看所有文章，用户权限不足')
            return Promise.reject(result)
          } else {
            // true表示正式文章库
            return getBook.getUserBookNum(true)
          }
        })
        .then((json) => {
          totalBookNum = json
          // console.log(json)
          return getBook.getUserBook(true, nowPage, username)
        })
        .then((json) => {
          result = {
            code: '0',
            data: {
              Total: totalBookNum,
              data: json
            },
            msg: '所有文章查询成功'
          }
          jsonWrite.jsonWrite(res, result)
        })
        .catch((err) => {
          jsonWrite.jsonWrite(res, err)
        })
    }
  },
  findAllLSBook: function (req, res, next) {
    var result = {}
    var $token = req.cookies.token
    var $params = req.body.params
    var totalBookNum
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
      var nowPage = $params.nowpage
      // 去寻找用户密保答案是否正确
      checkPermisson.checkUserPermission(username)
        .then((json) => {
          var permiss = json.permission
          // console.log(permiss !== '2' && permiss !== '1')
          if (permiss !== '2' && permiss !== '1') {
            result = {
              code: '1',
              msg: '用户权限不足'
            }
            console.log('查看所有文章，用户权限不足')
            return Promise.reject(result)
          } else {
            // true表示正式文章库
            return getBook.getUserBookNum(false)
          }
        })
        .then((json) => {
          totalBookNum = json
          // console.log(json)
          return getBook.getUserBook(false, nowPage, username)
        })
        .then((json) => {
          result = {
            code: '0',
            data: {
              Total: totalBookNum,
              data: json
            },
            msg: '所有文章查询成功'
          }
          jsonWrite.jsonWrite(res, result)
        })
        .catch((err) => {
          jsonWrite.jsonWrite(res, err)
        })
    }
  }
}
