var express = require('express')
var router = express.Router()
var mainAllBookDao = require('../dao/mainAllBookDao')
router.post('/findAllBook', function (req, res, next) {
  mainAllBookDao.findBook(req, res, next)
})
module.exports = router
