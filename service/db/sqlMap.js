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
    loginIn: 'select password, permission from userinfo where username = ?'
  },
  article: {
    newArticle: 'insert into lsarticle (username, title, content, fileLocation, commitTime, bookstatus) values (?,?,?,?,?,0)',
    secondeArticle: 'update lsarticle SET content = ?, fileLocation = ?, commitTime = ?, bookstatus = 0 where username = ? and title = ?'
  },
  Permission: {
    check: 'select permission from userinfo where username = ?'
  },
  userCenter: {
    getuserTotal: 'select count(*) as numT from userinfo where username != ?',
    getallUser: 'select username,permission,registertime from userinfo where username != ? limit ?,10',
    changeuserpermission: 'update userinfo SET permission = ? where username = ?',
    changeuserAnswer: 'update userinfo SET answer = ? where username =?',
    deleteUser: 'delete from userinfo where username = ?',
    changUserQuestionAnswer: 'update userinfo SET question = ?, answer = ? where username = ?'
  },
  Allbook: {
    // 获取所有图书总数
    getAllBookNum: 'select count(*) as numB from article',
    getAllLSBookNum: 'select count(*) as numB from lsarticle',
    getAllBook: 'select commitTime,title,username,fileLocation from article limit ?,10',
    getAllLSBook: 'select commitTime,title,username,fileLocation,bookstatus from lsarticle where username != ? limit ?,10',
    deleteAllBook: 'delete from article where username = ? and title = ?',
    deleteAllLSBook: 'delete from lsarticle where username = ? and title = ?'
  },
  shenheBook: {
    toSuccessBook: 'select username, title, content, fileLocation, commitTime from lsarticle where username = ? and title = ?',
    addAllBook: 'insert into article (username, title, content, fileLocation, commitTime) values (?,?,?,?,?)',
    changeButongGuostatus: 'update lsarticle SET bookstatus = 2 where username = ? and title = ?'
  },
  PersonAllbook: {
    getPersonAllBookNum: 'select count(*) as numB from article where username = ? ',
    getPersonAllLSBookNum: 'select count(*) as numB from lsarticle where username = ? ',
    getPersonAllBook: 'select commitTime,title,username,fileLocation from article where username = ? limit ?,10',
    getPersonAllLSBook: 'select commitTime,title,username,fileLocation,bookstatus from lsarticle where username = ? limit ?,10',
    deletePersonAllBook: 'delete from article where username = ? and title = ?',
    deletePersonAllLSBook: 'delete from lsarticle where username = ? and title = ?'
  },
  newArticle: {
    getOneBook: 'select title, content, fileLocation from lsarticle where username = ? and title = ?',
    lookOneBook: 'select username, title, content, fileLocation, commitTime from article where username = ? and title = ?',
    lookLSOneBook: 'select username, title, content, fileLocation, commitTime from lsarticle where username = ? and title = ?'
  },
  search: {
    keyWord: 'select title,username from article where title LIKE \'%?%\' OR username LIKE \'%?%\''
  },
  HotBookTop: {
    // 书籍热度加一
    BookaddOneHot: 'INSERT bookrank (title, username, hotcount) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE hotcount = hotcount + 1'
  },
  // 首页获取新书、热门书
  getNewHotBook: {
    getHotBook: 'select title, username from bookrank order by hotcount desc limit 10',
    getNewBook: 'select title, username from article order by commitTime desc limit 10'
  },
  aboutAnnounce: {
    commit: 'insert into announceTable (announce, commitTime, form) values (?,?,?)',
    getNowA: 'select commitTime, form, announce from announceTable order by commitTime desc limit 1'
  }
}
module.exports = sqlMap
