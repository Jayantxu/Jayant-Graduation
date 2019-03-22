var express = require('express')
var router = express.Router()
// 文章Dao
var BookTypeShowDao = require('../dao/BookTypeShowDao')
router.get('/GetBook', function (req, res, next) {
  BookTypeShowDao.getBook(req, res, next)
})
module.exports = router
