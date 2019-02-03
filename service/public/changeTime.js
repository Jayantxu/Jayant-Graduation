var moment = require('moment')
module.exports = {
  toSqlTime: function () {
    var tosqlT = moment().format('YYYY-MM-DD HH:mm:ss')
    return tosqlT
  },
  toSqlTime2: function () {
    var tosqlT = moment().format('YYYY-MM-DD')
    return tosqlT
  }
}
