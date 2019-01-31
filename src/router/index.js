import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import register from '../views/Register'
import findPWD from '../views/FindPWD'
import writeNewComment from '../views/writeNewComment'
import userCenter from '../views/userCenter'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/findPWD',
      name: '/findPWD',
      component: findPWD
    },
    {
      path: '/writeNewComment',
      name: '/writeNewComment',
      component: writeNewComment
    },
    {
      path: '/userCenter',
      name: '/userCenter',
      component: userCenter
    }
  ]
})
