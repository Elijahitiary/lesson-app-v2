import { createStore } from 'vuex'

export default createStore({
  state: {
    cart: [],
  },
  getters: {
    getTodoById(cart) {
      return cart
    }
  },
  mutations: {
    ADD_TO_CART(state, lesson) {
      state.cart.push(lesson)
    }
  },
  actions: {
  },
  modules: {
  }
})
