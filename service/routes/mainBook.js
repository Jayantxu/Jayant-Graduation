var express = require('express')
var router = express.Router()
var mainAllBookDao = require('../dao/mainAllBookDao')
router.post('/findAllBook', function (req, res, next) {
  mainAllBookDao.findBook(req, res, next)
})
router.post('/search', function (req, res, next) {
  mainAllBookDao.search(req, res, next)
})
router.get('/findRecentRecommend', function (req, res, next) {
  mainAllBookDao.recentAndrecommend(req, res, next)
})
module.exports = router
