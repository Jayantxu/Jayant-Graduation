var express = require('express')
var router = express.Router()
var checkLoginDao = require('../dao/checkLoginDao')
var findAllUserDao = require('../dao/findAllUserDao')
var changeUserpermissionDao = require('../dao/changeUserpermissionDao')
var changUserPwdDao = require('../dao/changUserPwdDao')
// 检验用户是否登录
router.post('/checkLogin', function (req, res, next) {
  checkLoginDao.checkLogin(req, res, next)
})
// 权限配置中心，寻找所有用户
router.post('/findAllUser', function (req, res, next) {
  findAllUserDao.findAllUser(req, res, next)
})
// 权限配置中心用户权限的更改
router.post('/changeUserPermission', function (req, res, next) {
  changeUserpermissionDao.changepermission(req, res, next)
})
// 权限配置中心重置用户密保
router.post('/changeUserAnswer', function (req, res, next) {
  changeUserpermissionDao.changeuserAnswer(req, res, next)
})
// 权限配置中心删除用户
router.post('/deleteUser', function (req, res, next) {
  changeUserpermissionDao.deleteUser(req, res, next)
})
// 权限配置中心用户修改密码
router.post('/changePWD', function (req, res, next) {
  changUserPwdDao.changePwd(req, res, next)
})
// 权限配置中心用户修改密保
router.post('/changeQUES', function (req, res, next) {
  changUserPwdDao.changeQUES(req, res, next)
})
module.exports = router
