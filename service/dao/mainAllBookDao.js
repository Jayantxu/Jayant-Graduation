// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var getBook = require('../public/getBook')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
//  搜索数据库关键字
var searchKeyWordPromise = function (queryWord) {
  var promise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        console.log('关键字搜索数据库连接出错')
        reject(result)
      }
      var sqlYUJUsearch = `select title, username from article where title like '%${queryWord}%' or username like '%${queryWord}%'`
      connection.query(sqlYUJUsearch, [queryWord, queryWord], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          pool.releaseConnection(connection)
          console.log('关键字搜索数据库语句出错')
          reject(result)
        } else {
          // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
          result = sqlformatJSON.transforms(result)
          resolve(result)
          pool.releaseConnection(connection)
        }
      })
    })
  })
  return promise
}
module.exports = {
  // 正式书库中找所有书
  findBook: function (req, res, next) {
    var result = {}
    var $params = req.body.params
    var totalBookNum
    var nowPage = $params.nowpage
    // 去寻找用户密保答案是否正确
    getBook.getUserBookNum(true)
      .then((json) => {
        //  记录图书总数
        totalBookNum = json
        return getBook.getUserBook(true, nowPage)
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
  },
  search: function (req, res, next) {
    var result = {}
    var $params = req.body.params
    var queryWord = $params.queryWord
    searchKeyWordPromise(queryWord)
      .then((json) => {
        result = {
          code: '0',
          data: {
            data: json
          },
          msg: '搜索完成'
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        jsonWrite.jsonWrite(res, err)
      })
  }
}
