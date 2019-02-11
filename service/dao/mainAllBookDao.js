// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var getBook = require('../public/getBook')
var jsonWrite = require('../public/jsonWrite')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)

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
  }
}
