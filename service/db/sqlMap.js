/* sql语句存放 */
var sqlMap = {
  user: {
    registerAdd: 'insert into userinfo (username, password, question, answer, permission) values (?,?,?,?,0)',
    registerQuery: 'select * from userinfo where username = ?'
  }
}
module.exports = sqlMap
