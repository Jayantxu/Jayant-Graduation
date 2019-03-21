var express = require('express')
var router = express.Router()
// 文章Dao
var BookTypeDao = require('../dao/BookTypeDao')
router.get('/getBookType', function (req, res, next) {
  BookTypeDao.getBookTypes(req, res, next)
})
module.exports = router
