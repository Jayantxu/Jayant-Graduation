const express = require('express')
const router = express.Router()
//  引入数据模块
const Hero = require('../models/heroSchema')

//  查询的路由
router.get('/hero', (req, res) => {
  Hero.find({})
    .sort({update_at: -1})
    .then(heros => {
      res.json(heros)
    })
    .catch(err => {
      console.log(2)
      res.json(err)
    })
})
//  通过ID查询单个英雄信息的路由
router.get('/hero/:id', (req, res) => {
  Hero.findById(req.params.id)
    .then(hero => {
      res.json(hero)
    })
    .catch(err => {
      res.json(err)
    })
})
//  添加一个英雄信息的路由
router.put('.hero/:id', (req, res) => {
  Hero.create(req.body, (err, hero) => {
    if (err) {
      res.json(err)
    } else {
      res.json(hero)
    }
  })
})
//  更新一个英雄信息的路由
router.put('/hero/:id', (req, res) => {
  Hero.findOneAndUpdate(
    {_id: req.params.id},
    {
      $set: {
        name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
        address: req.body.address,
        dowhat: req.body.dowhat,
        favourite: req.body.favourite,
        explain: req.body.explain
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err))
})
//  添加图片路由
router.put('/addpic/:id', (req, res) => {
  Hero.findOneAndUpdate(
    {_id: req.params.id},
    {
      $push: {
        imgArr: req.body.url
      }
    },
    {new: true}
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err))
})
//  删除一天英雄信息路由
router.delete('/hero/:id', (req, res) => {
  Hero.findOneAndDelete({
    _id: req.params.id
  })
    .then(hero => res.send(`${hero.title}删除成功`))
    .catch(err => res.json(err))
})
module.exports = router
