// 引入jsonwebtoken
var jwt = require('jsonwebtoken')
const secret = 'JayantXuAdmin' // 密钥
var token = {
  createToken: function (username) {
    var obj = {}
    var payload = {
      iss: 'JayantXu',
      uName: username,
      baseT: '0'
    }
    if (username === '') {
      obj = {
        bool: false,
        msg: '用户名生成Token错误',
        token: ''
      }
    } else {
      const token = jwt.sign(payload, secret, {
        // expiresIn: '1h'
      })
      obj = {
        bool: true,
        msg: '成功',
        token: token
      }
    }
    return obj
    // console.log(token)
  },
  decodeToken: function (token, username) {
    var obj = {}
    var result = jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        if (err.message === 'jwt expired') {
          obj = {
            bool: false,
            msg: '会话超时,请重新登录',
            token: ''
          }
        }
      } else {
        if (username !== decoded.uName) {
          obj = {
            bool: false,
            msg: '失败',
            token: decoded
          }
        } else {
          obj = {
            bool: true,
            msg: '成功',
            token: decoded
          }
        }
      }
      return obj
    })
    return result
  }
}
module.exports = token
