/*
@author: JayantXu
*/
// 将mysql的RowDataPacket格式转换为JSON
module.exports = {
  transforms: function (mysqlForm) {
    var toString = JSON.stringify(mysqlForm)
    var toJSON = JSON.parse(toString)
    return toJSON
  }
}
