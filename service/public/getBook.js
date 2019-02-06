// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
module.exports = {
  getUserBookNum: function (bool) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        var result = {}
        var str
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心查询所有文章总数数据库连接错误')
          reject(result)
        }
        // 如果是true查正式书库，false查新文章库
        str = bool ? $sql.Allbook.getAllBookNum : $sql.Allbook.getAllLSBookNum
        connection.query(str, (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心查询所有用户文章总数数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            resolve(result[0].numB)
          }
        })
      })
    })
  },
  getUserBook: function (bool, nowPage, username) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        var result = {}
        var str, arr
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心查询所有文章数据库连接错误')
          reject(result)
        }
        var sqlPage = (nowPage - 1) * 10
        str = bool ? $sql.Allbook.getAllBook : $sql.Allbook.getAllLSBook
        arr = bool ? sqlPage : [username, sqlPage]
        // console.log(nowPage)
        // console.log(username)
        connection.query(str, arr, (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心查询所有用户文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            // console.log(result)
            resolve(result)
          }
        })
      })
    })
  },
  deleteUserBook: function (bool, bookusername, booktitle) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        var result = {}
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心删除文章数据库连接错误')
          reject(result)
        }
        var str = bool ? $sql.Allbook.deleteAllBook : $sql.Allbook.deleteAllLSBook
        connection.query(str, [bookusername, booktitle], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心删除文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            // console.log(result)
            result = {
              code: '0',
              data: {
              },
              msg: '删除成功'
            }
            resolve(result)
          }
        })
      })
    })
  }
}
