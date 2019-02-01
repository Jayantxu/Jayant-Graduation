var express = require('express')
var router = express.Router()
var checkLoginDao = require('../dao/checkLoginDao')
// 检验用户是否登录
router.post('/checkLogin', function (req, res, next) {
  checkLoginDao.checkLogin(req, res, next)
})
module.exports = router
