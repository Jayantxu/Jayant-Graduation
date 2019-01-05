var express = require('express')
var router = express.Router()
router.post('/registeruser', function (req, res, next) {
  res.json({name: 'aaa', pwd: '123'})
})
module.exports = router
