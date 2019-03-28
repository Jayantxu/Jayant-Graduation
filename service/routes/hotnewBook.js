var express = require('express')
var router = express.Router()
var getHotNewBookDao = require('../dao/getHotNewBookDao')
router.get('/getHotBook', function (req, res, next) {
  getHotNewBookDao.getHotBook(req, res, next)
})
router.get('/getNewBook', function (req, res, next) {
  getHotNewBookDao.getNewBook(req, res, next)
})
router.get('/getTopHotBook', function (req, res, next) {
  getHotNewBookDao.getTopHotBook(req, res, next)
})
module.exports = router
