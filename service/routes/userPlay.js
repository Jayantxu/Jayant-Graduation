/*
用户相关的路由***用户注册, 修改密码, 用户登录,
*/
var express = require('express')
var router = express.Router()
// 注册用户Dao
var registerDao = require('../dao/registerDao')
// 修改密码Dao
var findPWDDao = require('../dao/findPWDDao')
// 用户登录\登出Dao
var loginUserDao = require('../dao/loginUserDao')
// 注册用户
router.post('/registeruser', function (req, res, next) {
  registerDao.add(req, res, next)
})
// 修改密码
router.get('/findQuestion', function (req, res, next) {
  findPWDDao.findQuestion(req, res, next)
})
router.post('/changePWD', function (req, res, next) {
  findPWDDao.changePWD(req, res, next)
})
// 用户登录
router.post('/loginIn', function (req, res, next) {
  loginUserDao.loginIn(req, res, next)
})
// 退出登录
router.post('/loginOut', function (req, res, next) {
  loginUserDao.loginOut(req, res, next)
})
module.exports = router
