const fs = require('fs')
const path = require('path')
const mineType = require('mime-types')
module.exports = {
  base64img: function (file) {
    var base64imgpromise = new Promise(function (resolve, reject) {
      var result
      if (!file) {
        result = ''
        resolve(result)
      }
      file = path.join(__dirname, '../', file)
      let filePath = path.resolve(file)
      fs.readFile(path.resolve(filePath), 'base64', function (err, data) {
        if (err) {
          console.log(err + '读取错误')
          result = {
            code: '1',
            data: {
            },
            msg: '服务器出错'
          }
          reject(result)
        }
        result = 'data:' + mineType.lookup(filePath) + ';base64,' + data
        resolve(result)
      })
    })
    return base64imgpromise
  }
}
