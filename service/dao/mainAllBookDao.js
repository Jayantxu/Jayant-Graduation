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
var searchKeyWordPromise = function (queryWord, queryType) {
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
      var sqlYUJUsearch
      if (queryType === 'booktype') {
        // 搜索的分类是书籍类别的情况
        sqlYUJUsearch = `select typeID, type from typeleixing where type like '%${queryWord}%'`
      } else if (queryType === 'user') {
        // 搜索的情况是用户名的情况
        sqlYUJUsearch = `select username from userinfo where username like '%${queryWord}%'`
      } else {
        // 搜索的分类是标题的情况
        sqlYUJUsearch = `select title, username from article where title like '%${queryWord}%'`
      }
      connection.query(sqlYUJUsearch, [queryWord], (err, result) => {
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
    var queryType = $params.queryType
    searchKeyWordPromise(queryWord, queryType)
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
