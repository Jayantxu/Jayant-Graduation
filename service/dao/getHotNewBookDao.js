// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var checkPermisson = require('../public/checkPermisson')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
var getHotBook = function (bookusername, booktitle) {
  var getHotBookpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        console.log(`获取热门书籍数据库错误---getHotBook---error`)
      }
      connection.query($sql.getNewHotBook.getHotBook, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
              hotBookTop10: []
            },
            msg: '查询出错'
          }
          pool.releaseConnection(connection)
          console.log('获取热门书籍数据库错误---数据库语句错误')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return getHotBookpromise
}
var getNewBook = function () {
  var getNewBookpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        console.log(`获取新书籍数据库错误---getNewBook---error`)
      }
      connection.query($sql.getNewHotBook.getNewBook, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
              hotBookTop10: []
            },
            msg: '查询出错'
          }
          pool.releaseConnection(connection)
          console.log('获取热门书籍数据库错误---数据库语句错误----getNewBook')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return getNewBookpromise
}
module.exports = {
  getHotBook: function (req, res, next) {
    getHotBook()
      .then((tjson) => {
        var json = sqlformatJSON.transforms(tjson)
        var result = {
          code: '0',
          data: {
            hotBookTop10: json
          },
          msg: '查询成功'
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        jsonWrite.jsonWrite(res, err)
      })
  },
  getNewBook: function (req, res, next) {
    getNewBook()
      .then((tjson) => {
        var json = sqlformatJSON.transforms(tjson)
        var result = {
          code: '0',
          data: {
            hotBookTop10: json
          },
          msg: '查询成功'
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        jsonWrite.jsonWrite(res, err)
      })
  }
}
