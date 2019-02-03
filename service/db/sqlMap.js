/* sql语句存放 */
var sqlMap = {
  // 注册的sql语句
  register: {
    registerAdd: 'insert into userinfo (username, password, question, answer, registertime, permission) values (?,?,?,?,?,0)',
    registerQuery: 'select * from userinfo where username = ?'
  },
  // 寻找-修改密码的sql语句
  findPWD: {
    findQuestion: 'select question,answer from userinfo where username = ?',
    changPWD: 'update userinfo SET password = ? where username = ?'
  },
  // 登录sql语句
  login: {
    loginIn: 'select password from userinfo where username = ?'
  },
  article: {
    newArticle: 'insert into lsarticle (username, title, content, fileLocation, commitTime) values (?,?,?,?,?)'
  },
  Permission: {
    check: 'select permission from userinfo where username = ?'
  },
  userCenter: {
    getuserTotal: 'select count(*) as numT from userinfo where username != ?',
    getallUser: 'select username,permission,registertime from userinfo where username != ? limit ?,10',
    changeuserpermission: 'update userinfo SET permission = ? where username = ?',
    changeuserAnswer: 'update userinfo SET answer = ? where username =?',
    deleteUser: 'delete from userinfo where username = ?'
  }
}
module.exports = sqlMap
