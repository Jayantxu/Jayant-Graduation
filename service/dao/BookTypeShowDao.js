// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)

// 获取该分类下的书籍总数
var getBookNumTotal = function ($ID) {
  var getBookNumTotalpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(`按书籍分类查找数据库错误---getBookNumTotal---error`)
      }
      // 获取分类书籍的数目总数
      var $sqlFind = `select count(*) as numA from article where booktype LIKE '%${$ID}%'`
      connection.query($sqlFind, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '获取书籍类别总数出错'
          }
          pool.releaseConnection(connection)
          console.log('获取书籍类别总数数据库错误---数据库语句错误----')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          result = sqlformatJSON.transforms(result)
          resolve(result[0].numA)
        }
      })
    })
  })
  return getBookNumTotalpromise
}

// 获取该分类下每一页书籍
var getEveryTypeBookPage = function ($ID, $Page) {
  var getEveryTypeBookPagepromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(`按书籍分类查找每一分页数据库错误---getEveryTypeBookPage---error`)
      }
      $Page = ($Page - 1) * 10
      var getTypeBookEveryPageSql = `select commitTime,title,username from article where booktype LIKE '%${$ID}%' limit ${$Page},10`
      connection.query(getTypeBookEveryPageSql, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '获取书籍类别总数出错'
          }
          pool.releaseConnection(connection)
          console.log('按书籍分类查找每一分页数据库错误---数据库语句错误----')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          result = sqlformatJSON.transforms(result)
          resolve(result)
        }
      })
    })
  })
  return getEveryTypeBookPagepromise
}
module.exports = {
  getBook: function (req, res, next) {
    var $params = req.query
    var bookTypeid = $params.bookTypeID // 查找的书籍类别ID
    var bookTypepage = $params.bookTypePage // 查找的类别页码
    var BookTypeTotalNum // 记录该分类书籍总数
    // 获取该类别的书籍总数
    getBookNumTotal(bookTypeid)
      .then((json) => {
        BookTypeTotalNum = json
        return getEveryTypeBookPage(bookTypeid, bookTypepage)
      })
      .then((json) => {
        console.log(json)
        var result = {
          code: '0',
          data: {
            BookList: json,
            TotalNum: BookTypeTotalNum
          },
          msg: '获取书籍类别列表'
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        jsonWrite.jsonWrite(res, err)
      })
  }
}
