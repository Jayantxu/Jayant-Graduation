// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
module.exports = {
  checkUserPermission: function (userName) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.log('权限配置中心数据库出错')
          reject(err)
        }
        var endresult = {}
        connection.query($sql.Permission.check, userName, (err, result) => {
          if (err) {
            endresult = {
              permission: 'err',
              msg: '权限配置语句错误'
            }
            reject(endresult)
            pool.releaseConnection(connection)
          } else {
            // 将寻找到的密码与加密后进行匹配,并在此处处理token问题
            var end = sqlformatJSON.transforms(result)
            endresult = {
              permission: end[0].permission
            }
            resolve(endresult)
            pool.releaseConnection(connection)
          }
        })
      })
    })
  }
}
