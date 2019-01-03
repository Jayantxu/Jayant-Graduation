var sqlMap = {
  user: {
    add: 'insert into userinfo (username, password, question, answer, permission) values (?,?,?,?,?)'
  }
}
module.exports = sqlMap
