/*
Session相关Token方法
*/
var crypto = require('crypto')
var token = {
    // 创造Token
    createToken: function () {
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