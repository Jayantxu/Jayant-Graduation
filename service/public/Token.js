/*
@ author JayantXu
  JWT结构：
  Header:{
      type:'jwt'    //声明类型
      alg:'SHA256'  //加密的算法
  }
  // 版本号用于鉴别退出登录,修改密码的操作,使得页面该账户无效;而时间可以鉴别该用户的长时间未操作而退出问题
  Payload:{
      iss:'JayantXu'    //签发者
      exp:''        //过期时间---
      iat:''        //签发的时间，create的时间
      baseT:''      // 版本号
  }
  signature:{   //base64后的header+payload;+secret(密钥)
    secret->JayantXu
  }
Session相关Token方法
*/
// 引入加解密处理方法
// var crypto = require('crypto')
// var token = {
//   createToken: function (obj, timeout) {
//     var Header = {
//       'type': 'jwt',
//       'alg': 'SHA256'
//     }
//     var obj2 = {
//       iss: 'JayantXu', // 签发者
//       exp: '', // 过期时间---
//       iat: '', // 签发的时间，create的时间
//       baseT: '' // 版本号
//     }
//     // payload信息
//     var base64Str = Buffer.from(JSON.stringify(obj2), 'utf8').toString('base64')
//     var secret = 'JayantXuAdmin'
//     var hash = crypto.createHmac('sha256', secret)
//     hash.update(base64Str)
//     var signature = hash.digest('base64')
//     return base64Str + '.' + signature
//   },
//   // 解密Token
//   decodeToken: function () {
//   },
//   // 检验Token
//   checkToken: function () {
//     var dectoken = this.decodeToken()
//   }

// }
// module.exports = token

// 已废弃,使用jsonwebtoken-npm
