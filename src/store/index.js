import Vue from 'vue'
import Vuex from 'vuex'
// 引入持久化vuex的插件
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    question: {
      'Q001': '你最喜欢的歌手?',
      'Q002': '你的工作?',
      'Q003': '你最喜欢的书籍?',
      'Q004': '你的出生地?'
    },
    isLogin: false,
    DLusername: '',
    meta: 0,
    bookType: []
  },
  getters: {
    // doneTodos: state => {
    //   return state.todos.filter(todo => todo.done)
    // }
    /* 以下是以方法的方式返回计算getters
    doneTodo: state => (id) => {
        return state.todos.find(todo => todo.id === id)
        }
    */
  },
  mutations: {
    // 用户登录登出,有个小标识,存在Store中,用于页面其他小元素的展示
    LoginIn (state, payload) {
      state.isLogin = !state.isLogin
      state.DLusername = payload.username
      state.meta = payload.userMeta
    },
    LoginOut (state) {
      state.isLogin = !state.isLogin
    },
    PutInBookType (state, payload) {
      state.bookType = payload.bookType
    }
    // decrement (state, payload) {
    //   state.counter -= payload.amount
    // },
    // SET_USER (state, payload) {
    //   console.log(`对state.pwd进行操作了`)
    //   state.pwd = payload.pwd
    // }
  },
  actions: {
    // 可处理异步的数据擦caouzo,context与store很相近,返回的是一个Promise
    // incrementAsync ({commit}) {
    //   setTimeout(() => {
    //     commit('decrement', {amount: 2})
    //   }, 500)
    // },
    // commit('SET_USER',{pwd :1234})
    // console.log('***********写入store的PWD');
  }
})
export default store
