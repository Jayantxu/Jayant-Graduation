/* sql语句存放 */
var sqlMap = {
  register: {
    registerAdd: 'insert into userinfo (username, password, question, answer, permission) values (?,?,?,?,0)',
    registerQuery: 'select * from userinfo where username = ?'
  },
  findPWD: {
    findPWDQuestion: 'select question,answer from userinfo where username = ?',
    findPWDchangePWD: 'update userinfo SET password = ?  where username = ?'
  },
  login: {
      login: 'select password from userinfo where username = ?'
  }
}
module.exports = sqlMap
