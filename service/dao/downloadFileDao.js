// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
var path = require('path')
var fs = require('fs')
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
var jsonWrite = require('../public/jsonWrite')
var getPersonBook = require('../public/getPersonBook')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
module.exports = {
  chooseFile: function (req, res, next) {
    var result = {}
    var $token = req.cookies.token
    // 获取用户传递参数
    var $params = req.query
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
      var fileName = $params.fileName
      // jayant_graduation\service\uploadfile\18913许俊彦前端开发简历.pdf
      var currFile = path.join(__dirname, '../uploadFile/' + fileName)
      // console.log(urrFilce)
      fs.exists(currFile, function (exists) {
        if (exists) {
          console.log('文件存在')
          // var fReadStream = fs.createReadStream(currFile)
          // fReadStream.on('data', (chunk) => res.write(chunk, 'binary'))
          // fReadStream.on('end', function () {
          //   res.end()
          // })
          res.download(currFile)
        } else {
          result = {
            // 40表未登录
            code: '1',
            data: {
            },
            msg: '文件不存在'
          }
          jsonWrite.jsonWrite(res, result)
        }
      })
    }
  }
}
