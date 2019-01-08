/*
@author: JayantXu
*/
// 引入加密模块
const crypto = require('crypto')
module.exports = {
  // 注册时的密码加密
  bcryptInfo: function (param) {
    const SHA256hash = crypto.createHash('sha256')
    SHA256hash.update(param)
    return SHA256hash.digest('hex')
  }
}
