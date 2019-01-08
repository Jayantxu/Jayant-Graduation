var express = require('express')
var router = express.Router()
var findPWDDao = require('../dao/findPWDDao')
// 找回密码
router.post('/findPWD', function (req, res, next) {
    findPWDDao.find(req, res, next)
})
module.exports = router
