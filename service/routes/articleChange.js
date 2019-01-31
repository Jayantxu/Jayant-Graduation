/*
文章相关的路由***
*/
var express = require('express')
var router = express.Router()
// 文章Dao
var ArticleDao = require('../dao/ArticleDao')
// 退出登录
router.post('/commitNewArticle', function (req, res, next) {
  ArticleDao.commitNewArticle(req, res, next)
})
router.post('/uploadFile', function (req, res, next) {
  ArticleDao.uploadFile(req, res, next)
})
module.exports = router
