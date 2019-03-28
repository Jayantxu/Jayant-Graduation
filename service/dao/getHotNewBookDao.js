// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var BookTypeShowDao = require('./BookTypeShowDao')
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
// 寻找最热门书籍的类别
var getRankTopHotBook = function () {
  var getRankTopHotBookpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(`获取点击数最大的书籍数据库错误---getRankTopHotBook---error`)
        var result = {
          code: '1',
          data: {
          },
          msg: '查询出错'
        }
        reject(result)
      }
      connection.query($sql.getNewHotBook.getRankTopHot, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '查询出错'
          }
          pool.releaseConnection(connection)
          console.log('获取点击数最大的书籍数据库错误---数据库语句错误----getNewBook')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          var toJSON = sqlformatJSON.transforms(result)
          result = toJSON[0]
          resolve(result)
        }
      })
    })
  })
  return getRankTopHotBookpromise
}
var getRankTopHotBook1 = function (title, username) {
  var getRankTopHotBook1promise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(`获取点击数最大的书籍的类别数据库错误---getRankTopHotBook1---error`)
        var result = {
          code: '1',
          data: {
          },
          msg: '查询出错'
        }
        reject(result)
      }
      connection.query($sql.getNewHotBook.getRankTopHotType, [title, username], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '查询出错'
          }
          pool.releaseConnection(connection)
          console.log('获取点击数最大的书籍的类别数据库错误---数据库语句错误----getRankTopHotBook1')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          var toJSON = sqlformatJSON.transforms(result)
          resolve(toJSON[0])
        }
      })
    })
  })
  return getRankTopHotBook1promise
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
  },
  getTopHotBook: function (req, res, next) {
    getRankTopHotBook().then((json) => {
      var title = json.title
      var username = json.username
      return getRankTopHotBook1(title, username)
    }).then((json) => {
      var booktype = json.booktype.split(',')[0]
      return BookTypeShowDao.getEveryType(booktype, 1)
    }).then((json) => {
      var rankBookType1 = []
      var rankBookType2 = []
      if (json.length > 5) {
        rankBookType1 = json.slice(0, 5)
        rankBookType2 = json.slice(5, json.length)
      } else {
        rankBookType1 = json
      }
      var result = {
        code: '0',
        data: {
          rankType1: rankBookType1,
          rankType2: rankBookType2,
          len: json.length
        },
        msg: '查询成功'
      }
      jsonWrite.jsonWrite(res, result)
    }).catch((err) => {
      jsonWrite.jsonWrite(res, err)
    })
  }
}
