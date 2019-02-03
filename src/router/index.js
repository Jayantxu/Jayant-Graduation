import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import register from '../views/Register'
import findPWD from '../views/FindPWD'
import writeNewComment from '../views/writeNewComment'
import userCenter from '../views/userCenter'
import allArticleControl from '../views/FirstNav/allArticleControl'
import changePersonInfo from '../views/FirstNav/changePersonInfo'
import mySelfArticle from '../views/FirstNav/mySelfArticle'
import NewArticleControl from '../views/FirstNav/NewArticleControl'
import permissionC from '../views/FirstNav/permissionC'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      hidden: true,
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      hidden: true,
      component: register
    },
    {
      path: '/findPWD',
      name: '/findPWD',
      hidden: true,
      component: findPWD
    },
    {
      path: '/writeNewComment',
      name: '/writeNewComment',
      hidden: true,
      component: writeNewComment
    },
    {
      path: '/userCenter',
      name: '个人中心',
      component: userCenter,
      hidden: false,
      children: [
        // 用户中心侧边栏功能
        {
          path: '/userCenter/changePersonInfo',
          name: '个人信息修改',
          component: changePersonInfo,
          hidden: false
        },
        {
          path: '/userCenter/mySelfArticle',
          name: '个人文章管理',
          component: mySelfArticle,
          hidden: false,
          hasSChild: true
        }
      ]
    },
    {
      path: '/userCenter',
      name: '管理员中心',
      component: userCenter,
      hidden: false,
      children: [
        // 用户中心侧边栏功能
        {
          path: '/userCenter/allArticleControl',
          name: '所有文章',
          component: allArticleControl,
          hidden: false
        },
        {
          path: '/userCenter/NewArticleControl',
          name: '新文章管理',
          component: NewArticleControl,
          hidden: false
        }
      ]
    },
    {
      path: 'userCenter',
      name: '权限管理',
      component: userCenter,
      hidden: false,
      children: [
        // 用户中心侧边栏功能
        {
          path: '/userCenter/permissionC',
          name: '权限配置中心',
          component: permissionC,
          hidden: false
        }
      ]
    }
  ]
})
