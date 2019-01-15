/* sql语句存放 */
var sqlMap = {
  // 注册的sql语句
  register: {
    registerAdd: 'insert into userinfo (username, password, question, answer, permission) values (?,?,?,?,0)',
    registerQuery: 'select * from userinfo where username = ?'
  },
  // 寻找-修改密码的sql语句
  findPWD: {
    findQuestion: 'select question,answer from userinfo where username = ?',
    changPWD: 'update userinfo SET password = ? where username = ?'
  },
  // 登录sql语句
  login: {
    checkLogin: 'select password from userinfo where username = ?'
  }
}
module.exports = sqlMap
