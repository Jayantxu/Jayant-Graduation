/* sql语句存放 */
var sqlMap = {
  register: {
    registerAdd: 'insert into userinfo (username, password, question, answer, permission) values (?,?,?,?,0)',
    registerQuery: 'select * from userinfo where username = ?'
  },
  findPWD: {
    findQuestion: 'select question,answer from userinfo where username = ?',
    changPWD: 'update userinfo SET password = ? where username = ?'
  }
}
module.exports = sqlMap
