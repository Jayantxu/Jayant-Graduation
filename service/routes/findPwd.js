var express = require('express')
var router = express.Router()
var findPWDDao = require('../dao/findPWDDao')
// 寻找问题
router.get('/findQuestion', function (req, res, next) {
  findPWDDao.findQuestion(req, res, next)
})
router.post('/changePWD', function (req, res, next) {
  findPWDDao.changePWD(req, res, next)
})
module.exports = router
