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
          jsonWrite.jsonWrite(res, result)
        })
        .catch((err) => {
          jsonWrite.jsonWrite(res, err)
        })
    }
  }
}
