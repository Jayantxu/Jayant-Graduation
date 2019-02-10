var express = require('express')
var router = express.Router()
var bookCAOZUODao = require('../dao/bookCAOZUODao')
router.post('/getPersonOneBook', function (req, res, next) {
  bookCAOZUODao.getOneBook(req, res, next)
})
router.post('/lookPersonOneBook', function (req, res, next) {
  bookCAOZUODao.lookOneBook(req, res, next)
})
module.exports = router
