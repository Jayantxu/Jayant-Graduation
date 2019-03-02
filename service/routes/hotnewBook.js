var express = require('express')
var router = express.Router()
var getHotNewBookDao = require('../dao/getHotNewBookDao')
router.get('/getHotBook', function (req, res, next) {
  getHotNewBookDao.getHotBook(req, res, next)
})
module.exports = router
