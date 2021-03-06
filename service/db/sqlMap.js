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
    loginIn: 'select password, permission from userinfo where username = ?',
    findUserExist: 'select count(*) as num from userinfo where username = ?'
  },
  article: {
    newArticle: 'insert into lsarticle (username, title, content, fileLocation, commitTime, bookstatus, booktype, picLocation) values (?,?,?,?,?,0,?,?)',
    secondeArticle: 'update lsarticle SET content = ?, fileLocation = ?, commitTime = ?, bookstatus = 0, booktype = ?, picLocation = ? where username = ? and title = ?'
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
    getAllBook: 'select commitTime,title,username,fileLocation,booktype from article limit ?,10',
    getAllLSBook: 'select commitTime,title,username,fileLocation,bookstatus from lsarticle where username != ? limit ?,10',
    deleteAllBook: 'delete from article where username = ? and title = ?',
    deleteAllLSBook: 'delete from lsarticle where username = ? and title = ?'
  },
  shenheBook: {
    toSuccessBook: 'select username, title, content, fileLocation, commitTime, booktype, picLocation from lsarticle where username = ? and title = ?',
    addAllBook: 'insert into article (username, title, content, fileLocation, commitTime, booktype, picLocation) values (?,?,?,?,?,?,?)',
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
    lookOneBook: 'select username, title, content, fileLocation, commitTime, booktype from article where username = ? and title = ?',
    lookLSOneBook: 'select username, title, content, fileLocation, commitTime, booktype from lsarticle where username = ? and title = ?'
  },
  search: {
    keyWord: 'select title,username from article where title LIKE \'%?%\' OR username LIKE \'%?%\''
  },
  HotBookTop: {
    // 书籍热度加一
    BookaddOneHot: 'INSERT bookrank (title, username, hotcount) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE hotcount = hotcount + 1',
    // 记录最新阅读
    RecentLookingBook: 'INSERT recentlooking (username, looktitle, lookauthor, booktype) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE looktitle = ?, lookauthor = ?, booktype = ?',
    // 获取最新阅读书籍
    getRecentLooking: 'select title, username, picLocation, booktype from article where title = (select looktitle from recentlooking where username = ? ) AND username = (select lookauthor from recentlooking where username = ?)'
  },
  // 首页获取新书、热门书
  getNewHotBook: {
    getHotBook: 'select title, username from bookrank order by hotcount desc limit 10',
    getNewBook: 'select title, username from article order by commitTime desc limit 10',
    getRankTopHot: `select title, username from bookrank where hotcount = (select MAX(hotcount) as maxclickNum FROM bookrank)`,
    getRankTopHotType: `select booktype from article where title = ? and username = ?`
  
  },
  aboutAnnounce: {
    commit: 'insert into announceTable (announce, commitTime, form) values (?,?,?)',
    getNowA: 'select commitTime, form, announce from announceTable order by commitTime desc limit 1'
  },
  bookType: {
    getBookTypes: 'select * from typeLeixing',
    setBookTypes: 'insert into typeleixing (type) values (?)'
  }
}
module.exports = sqlMap
