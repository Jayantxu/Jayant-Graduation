var express = require('express')
var router = express.Router()
var checkLoginDao = require('../dao/checkLoginDao')
var findAllUserDao = require('../dao/findAllUserDao')
var findAllBookDao = require('../dao/findAllBookDao')
var changeUserpermissionDao = require('../dao/changeUserpermissionDao')
var changUserPwdDao = require('../dao/changUserPwdDao')
var AnnounceDao = require('../dao/AnnounceDao')
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
router.post('/findAllBook', function (req, res, next) {
  findAllBookDao.findAllBook(req, res, next)
})
router.post('/findAllLSBook', function (req, res, next) {
  findAllBookDao.findAllLSBook(req, res, next)
})
// 所有文章中删除
router.post('/deleteAllBook', function (req, res, next) {
  findAllBookDao.deleteAllBook(req, res, next)
})
// 审核通过某书籍
router.post('/LSBooktoSuccess', function (req, res, next) {
  findAllBookDao.toSuccessBook(req, res, next)
})
// 审核不通过某书籍
router.post('/LSBooktoError', function (req, res, next) {
  findAllBookDao.toErrorBook(req, res, next)
})
// 个人查看已发布的文章
router.post('/personfindAllBook', function (req, res, next) {
  findAllBookDao.personfindAllBook(req, res, next)
})
// 个人文章的删除操作
router.post('/deletePersonBook', function (req, res, next) {
  findAllBookDao.deletePersonBook(req, res, next)
})
router.post('/newAnnounce', function (req, res, next) {
  AnnounceDao.commitnewA(req, res, next)
})
router.get('/nowAnnounce', function (req, res, next) {
  AnnounceDao.getNowA(req, res, next)
})
module.exports = router
