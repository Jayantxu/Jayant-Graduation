module.exports = {
  // 注册时的密码加密
  jsonWrite: function (res, ret) {
    if (typeof ret === 'undefined') {
      res.json({
        code: '1',
        msg: '操作失败'
      })
    } else {
      res.json(ret)
    }
  }
}
