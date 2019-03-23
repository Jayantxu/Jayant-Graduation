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
  getUserBookNum: function (bool) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        var result = {}
        var str
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心查询所有文章总数数据库连接错误')
          reject(result)
        }
        // 如果是true查正式书库，false查新文章库
        str = bool ? $sql.Allbook.getAllBookNum : $sql.Allbook.getAllLSBookNum
        connection.query(str, (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心查询所有用户文章总数数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            resolve(result[0].numB)
          }
        })
      })
    })
  },
  getUserBook: function (bool, nowPage, username) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        var result = {}
        var str, arr
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心查询所有文章数据库连接错误')
          reject(result)
        }
        var sqlPage = (nowPage - 1) * 10
        str = bool ? $sql.Allbook.getAllBook : $sql.Allbook.getAllLSBook
        arr = bool ? sqlPage : [username, sqlPage]
        // console.log(nowPage)
        // console.log(username)
        connection.query(str, arr, (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心查询所有用户文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            // console.log(result)
            resolve(result)
          }
        })
      })
    })
  },
  deleteUserBook: function (bool, bookusername, booktitle) {
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
          console.log('个人中心删除文章数据库连接错误')
          reject(result)
        }
        var str = bool ? $sql.Allbook.deleteAllBook : $sql.Allbook.deleteAllLSBook
        connection.query(str, [bookusername, booktitle], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心删除文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            // console.log(result)
            result = {
              code: '0',
              data: {
              },
              msg: '删除成功'
            }
            resolve(result)
          }
        })
      })
    })
  },
  // 临时表中审核通过文章
  deleteAndGetLSBook: function (bookusername, booktitle) {
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
          console.log('新文章管理通过新文章数据库连接错误')
          reject(result)
        }
        console.log(`${bookusername},${booktitle}`)
        connection.query($sql.shenheBook.toSuccessBook, [bookusername, booktitle], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('新文章管理通过新文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            resolve(result[0])
          }
        })
      })
    })
  },
  addNewBookAllBook: function (username, title, content, file, booktype) {
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
          console.log('新文章审核通过写入新文章数据库连接错误')
          reject(result)
        }
        var commitData = changeTime.toSqlTime() // 转指定格式时间
        connection.query($sql.shenheBook.addAllBook, [username, title, content, file, commitData, booktype], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('新文章审核通过写入新文章数据库语句出错')
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
  },
  changeStatusLSBook: function (bookname, title) {
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
          console.log('新文章审核不通过通过数据库连接错误')
          reject(result)
        }
        connection.query($sql.shenheBook.changeButongGuostatus, [bookname, title], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('新文章审核不通过通过数据库语句出错')
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
  },
  // 个人的书籍部分
  getPersonBookNum: function (bool, username) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        var result = {}
        var str
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心查询个人文章总数数据库连接错误')
          reject(result)
        }
        // 如果是true查正式书库，false查新文章库
        str = bool ? $sql.PersonAllbook.getPersonAllBookNum : $sql.PersonAllbook.getPersonAllLSBookNum
        connection.query(str, username, (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心查询个人文章总数数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            resolve(result[0].numB)
          }
        })
      })
    })
  },
  getPersonUserBook: function (bool, nowPage, username) {
    return new Promise(function (resolve, reject) {
      pool.getConnection(function (err, connection) {
        var result = {}
        var str
        if (err) {
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          console.log('个人中心查询个人文章数据库连接错误')
          reject(result)
        }
        var sqlPage = (nowPage - 1) * 10
        str = bool ? $sql.PersonAllbook.getPersonAllBook : $sql.PersonAllbook.getPersonAllLSBook
        // console.log(nowPage)
        // console.log(username)
        connection.query(str, [username, sqlPage], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人中心查询个人文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            // console.log(result)
            resolve(result)
          }
        })
      })
    })
  },
  deletePersonUserBook: function (bool, bookusername, booktitle) {
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
          console.log('个人文章管理删除文章数据库连接错误')
          reject(result)
        }
        var str = bool ? $sql.PersonAllbook.deletePersonAllBook : $sql.PersonAllbook.deletePersonAllLSBook
        connection.query(str, [bookusername, booktitle], (err, result) => {
          if (err) {
            result = {
              code: '1',
              data: {
              },
              msg: '服务器出错'
            }
            console.log('个人文章管理删除文章数据库语句出错')
            pool.releaseConnection(connection)
            reject(result)
          } else {
            pool.releaseConnection(connection)
            result = sqlformatJSON.transforms(result)
            // console.log(result)
            result = {
              code: '0',
              data: {
              },
              msg: '删除成功'
            }
            resolve(result)
          }
        })
      })
    })
  }
}
