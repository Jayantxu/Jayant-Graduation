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
// 获取用户最新阅读的书籍信息
var recentRecommend = function (username) {
  var recentRecommendpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        console.log('搜索用户最近阅读数据库连接出错')
        reject(result)
      }
      connection.query($sql.HotBookTop.getRecentLooking, [username], (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          pool.releaseConnection(connection)
          console.log('搜索用户最近阅读数据库语句出错')
          reject(result)
        } else {
          result = sqlformatJSON.transforms(result)
          resolve(result[0])
          pool.releaseConnection(connection)
        }
      })
    })
  })
  return recentRecommendpromise
}
// 获取推荐的阅读
var getRecommend = function (recentBooktype) {
  var recentBookArr = recentBooktype.split(',')
  var recommendArr = []
  for (let i of recentBookArr) {
    if (i) {
      recommendArr.push(i)
    }
  }
  var sqlsstr = `booktype LIKE '%${recommendArr[0]}%'`
  for (var i = 1; i < recommendArr.length; i++) {
    sqlsstr += `or booktype LIKE '%${recommendArr[i]}%'`
  }
  var $recommendSQL = `select username, title from article where ${sqlsstr}`
  var getRecommendpromise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      var result = {}
      if (err) {
        result = {
          code: '1',
          data: {
          },
          msg: '服务器出错'
        }
        console.log('推荐用户阅读数据库连接出错')
        reject(result)
      }
      connection.query($recommendSQL, (err, result) => {
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          pool.releaseConnection(connection)
          console.log('推荐用户最近阅读数据库语句出错')
          reject(result)
        } else {
          result = sqlformatJSON.transforms(result)
          resolve(result)
          pool.releaseConnection(connection)
        }
      })
    })
  })
  return getRecommendpromise
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
  },
  recentAndrecommend: function (req, res, next) {
    var $params = req.query
    var username = $params.username
    var recentResult // 记录最近阅读
    var recommendResult = [] // 记录推荐的阅读
    recentRecommend(username)
      .then((json) => {
        recentResult = json
        var recentBooktype = json.booktype
        return getRecommend(recentBooktype)
      })
      .then((json) => {
        // 如果大于等于三本，则推荐三本，否则全部返回
        var recommendlen = json.length
        var result
        if (recommendlen >= 3) {
          for (var j = 1; j <= 3; j++) {
            var num = Math.floor(Math.random() * recommendlen)
            recommendResult.push(json[num])
          }
          result = {
            code: '0',
            data: {
              recentResultData: recentResult,
              recommendResultData: recommendResult
            },
            msg: '搜索完成'
          }
        } else {
          recommendResult = json
          result = {
            code: '0',
            data: {
              recentResultData: recentResult,
              recommendResultData: recommendResult
            },
            msg: '完成'
          }
        }
        jsonWrite.jsonWrite(res, result)
      })
      .catch((err) => {
        console.log(err)
        jsonWrite.jsonWrite(res, err)
      })
  }
}
