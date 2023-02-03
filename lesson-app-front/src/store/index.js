import { createStore } from 'vuex'

export default createStore({
  state: {
    cart: [],
    cardCount: Number(localStorage.getItem('cartCount')),
  },
  getters: {
    getCart(cart) {
      return cart
    },
  },
  mutations: {
    ADD_TO_CART(state, lesson) {
      state.cart.push(lesson)
    },
  },
})
