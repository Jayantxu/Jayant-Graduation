/*
@ author JayantXu
  JWT结构：
  Header:{
      type:'jwt'    //声明类型
      alg:'SHA256'  //加密的算法
  }
  Payload:{
      iss:'JayantXu'    //签发者
      exp:''        //过期时间
      iat:''        //签发的时间，create的时间
  }
  signature:{   //base64后的header+payload;+secret(密钥)
  }
Session相关Token方法
*/
var crypto = require('crypto')
var token = {
  createToken: function (obj, timeout) {
  },
  // 解密Token
  decodeToken: function () {
  },
  // 检验Token
  checkToken: function () {
    var dectoken = this.decodeToken()
  }

}
module.exports = token
