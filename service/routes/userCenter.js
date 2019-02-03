var express = require('express')
var router = express.Router()
var checkLoginDao = require('../dao/checkLoginDao')
var findAllUserDao = require('../dao/findAllUserDao')
var changeUserpermissionDao = require('../dao/changeUserpermissionDao')
// 检验用户是否登录
router.post('/checkLogin', function (req, res, next) {
  checkLoginDao.checkLogin(req, res, next)
})
router.post('/findAllUser', function (req, res, next) {
  findAllUserDao.findAllUser(req, res, next)
})
router.post('/changeUserPermission', function (req, res, next) {
  changeUserpermissionDao.changepermission(req, res, next)
})
module.exports = router
