
var express = require('express')
var router = express.Router()
var downloadFileDao = require('../dao/downloadFileDao')
router.get('/File', function (req, res, next) {
  downloadFileDao.chooseFile(req, res, next)
})
module.exports = router
