// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var changeTime = require('../public/changeTime')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
module.exports = {
  getOneBook: function (bookusername, booktitle) {
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
          console.log('个人文章管理带发布文章数据库连接错误')
          reject(result)
        }
        connection.query($sql.newArticle.getOneBook, [bookusername, booktitle], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人文章管理带发布文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            resolve(result)
          }
        })
      })
    })
  }
}
