// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
module.exports = {
  checkUserAnswerCoomon: function (userName, answer) {
    return new Promise(function (resolve, reject) {
      var result = {}
      pool.getConnection(function (err, connection) {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          err = '删除用户，管理员答案连接数据库连接错误'
          reject(result)
          console.log(err)
        }
        connection.query($sql.findPWD.findQuestion, userName, (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            err = '删除用户，管理员答案连接数据库查询语句错误'
            reject(result)
            console.log(err)
            pool.releaseConnection(connection)
          } else {
            // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
            result = sqlformatJSON.transforms(result)
            if (answer === result[0].answer) {
              resolve('1')
              pool.releaseConnection(connection)
            } else {
              result = {
                code: '1',
                data: {
                },
                msg: '密保答案出错'
              }
              err = '删除用户，管理员密保出错'
              reject(result)
              console.log(err)
              pool.releaseConnection(connection)
            }
          }
        })
      })
    })
  }
}
