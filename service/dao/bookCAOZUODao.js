// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var jsonWrite = require('../public/jsonWrite')
var getPersonBook = require('../public/getPersonBook')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
// 热榜+1功能
var addHotBook = function (bookusername, booktitle) {
  var addHotBookpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        console.log(`书籍热榜，图书热度加一数据库错误---addHotBook---error`)
      }
      connection.query($sql.HotBookTop.BookaddOneHot, [booktitle, bookusername], (err, result) => {
        if (err) {
          result = {
            msg: '书籍热榜，图书热度加一错误---数据库语句错误'
          }
          pool.releaseConnection(connection)
          reject(result)
        } else {
          result = {
            msg: '书籍热度加一'
          }
          pool.releaseConnection(connection)
          resolve(result)
        }
      })
    })
  })
  return addHotBookpromise
}
module.exports = {
  getOneBook: function (req, res, next) {
    var result = {}
    var $token = req.cookies.token
    // 获取用户传递参数
    var $params = req.body.params
    console.log('进入个人文章带发布文章管理')
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
      var bookusername = $params.bookusername
      var booktitle = $params.booktitle
      getPersonBook.getOneBook(bookusername, booktitle)
        .then((json) => {
          result = {
            // 40表未登录
            code: '0',
            data: {
              data: json
            },
            msg: '获取成功'
          }
          jsonWrite.jsonWrite(res, result)
        })
        .catch((err) => {
          jsonWrite.jsonWrite(res, err)
        })
    }
  },
  lookOneBook: function (req, res, next) {
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
      jsonWrite.jsonWrite(res, result)
    } else {
      var bookusername = $params.bookusername
      var booktitle = $params.booktitle
      var bookTF = $params.bookTF
      getPersonBook.lookOneBook(bookusername, booktitle, bookTF)
        .then((json) => {
          result = {
            // 40表未登录
            code: '0',
            data: {
              data: json
            },
            msg: '获取成功'
          }
          // 记录书籍点击后的热度+,正式书籍的情况下,false的情况下就是正式书库
          if (bookTF === 'false') {
            addHotBook(bookusername, booktitle).then((json) => {
              console.log(json.msg)
            })
            jsonWrite.jsonWrite(res, result)
          } else {
            jsonWrite.jsonWrite(res, result)
          }
        })
        .catch((err) => {
          jsonWrite.jsonWrite(res, err)
        })
    }
  }
}
