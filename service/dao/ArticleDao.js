// 实现与数据库交互
var mysql = require('mysql')
var $conn = require('../db/db')
var $sql = require('../db/sqlMap')
var fs = require('fs')
var path = require('path')
var changeTime = require('../public/changeTime')
// 引入token方法
var tokenFun = require('../public/Token')
// 使用连接池,提升性能
var pool = mysql.createPool($conn.mysql)
// 引入mysql转JSON
var sqlformatJSON = require('../public/sqlformatJSON')
// 接收文件
var formidable = require('formidable')
var form = new formidable.IncomingForm()
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}
module.exports = {
  commitNewArticle: function (req, res, next) {
    var $params = req.body.params
    var result = {}
    var $token = req.cookies.token
    if (!$token) {
      result = {
        // 40表未登录
        code: '40',
        data: {
        },
        msg: '用户未登录'
      }
      jsonWrite(res, result)
    } else {
      var $Xtoken = tokenFun.decodeToken($token, $params.username)
      if (!$Xtoken.bool) {
        // 用户名与token信息不一致的情况
        result = {
          // 40表未登录
          code: '50',
          data: {
          },
          msg: '未知错误'
        }
        jsonWrite(res, result)
      } else {
        // 提交时间戳,用户名，标题，内容
        var commitData = changeTime.toSqlTime() // 转指定格式时间
        // console.log(`${commitData}+${username}+${title}+${content}`)
        pool.getConnection(function (err, connection) {
          if (err) {
            throw new Error('用户新文章数据库连接出错')
          }
          connection.query($sql.article.newArticle, [$params.username, $params.articleTitle, $params.articleContent, commitData], function (err, result) {
            if (err) {
              result = {
                code: '1',
                data: {
                  commitTime: commitData,
                  username: $params.username
                },
                msg: '服务器出错'
              }
              jsonWrite(res, result)
              connection.release()
              console.log(err)
              // throw new Error('用户新增新文章数据库语句出错')
            }
            // result = sqlformatJSON.transforms(result)
            result = {
              // 40表未登录
              code: '0',
              data: {
                commitTime: commitData,
                username: $params.username
              },
              msg: '成功提交，请等待管理员审核，2秒后将跳转主页'
            }
            jsonWrite(res, result)
            connection.release()
          })
        })
      }
    }
  },
  uploadFile: function (req, res, next) {
    form.uploadDir = './uploadFile'
    form.parse(req, function (err, field, files) {
      // fields存放json数据，files存放的是文件信息
      files.field = field
      // 旧目录
      console.log(files.file.path)
      let oldpath = path.join(files.file.path)
      var JsonFile = files.file
      var fileName = JsonFile.name
      console.log(fileName)
      // 新的目录，为了防止同名，再加上随机数
      var ranFileName = String(parseInt(Math.random() * 8999 + 10000)).concat(fileName)
      console.log(ranFileName)
      let newpath = path.join('./uploadFile', ranFileName)
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          throw Error(err)
        }
      })
      if (err) {
        console.log('出错')
      }
    })
  }
}
