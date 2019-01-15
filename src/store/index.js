import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    question: {
      'Q001': '你最喜欢的歌手?',
      'Q002': '你的工作？',
      'Q003': '你最喜欢的书籍？'
    }
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
    /* 以下是以方法的方式返回计算getters
    doneTodo: state => (id) => {
        return state.todos.find(todo => todo.id === id)
        }
    */
  },
  mutations: {
    increment (state) {
      state.counter++
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
