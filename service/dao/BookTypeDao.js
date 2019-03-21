// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var changeTime = require('../public/changeTime')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
var getBooktype = function () {
  var getBooktypepromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(`获取书籍分类错误---getBooktype---error`)
      }
      connection.query($sql.bookType.getBookTypes, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '获取书籍分类出错'
          }
          pool.releaseConnection(connection)
          console.log('获取书籍分类数据库错误---数据库语句错误----')
          reject(result)
        } else {
          pool.releaseConnection(connection)
          result = sqlformatJSON.transforms(result)
          resolve(result)
        }
      })
    })
  })
  return getBooktypepromise
}
module.exports = {
  getBookTypes: function (req, res, next) {
    getBooktype()
      .then((json) => {
        var result = {
          code: '0',
          data: {
            type: json
          },
          msg: '成功获取书籍分类'
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        jsonWrite.jsonWrite(res, err)
      })
  }
}
