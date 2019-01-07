var express = require('express')
var router = express.Router()
var registerDao = require('../dao/registerDao')
// 注册用户
router.post('/registeruser', function (req, res, next) {
  registerDao.add(req, res, next)
})
module.exports = router
