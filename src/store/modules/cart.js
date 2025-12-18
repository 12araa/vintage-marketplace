export default {
  namespaced: true,
  state: {
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  },
  getters: {
    cartCount: (state) => {
      return state.cart.length
    }
  },
  mutations: {
    ADD_ITEM(state, product) {
      const existingItem = state.cart.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1
      } else {
        state.cart.push({ ...product, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    DECREMENT_ITEM(state, cartItemId) {
      const existingItem = state.cart.find(item => item.id === cartItemId)
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity--
        } else {
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    REMOVE_ITEM(state, cartItemId) {
      state.cart = state.cart.filter(item => item.id !== cartItemId)
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    CLEAR_CART(state) {
      state.cart = [] 
      localStorage.removeItem('cart') 
    },
  },
  actions: {
    addToCart({ commit }, product) {
      commit('ADD_ITEM', product)
    },
    decreaseQty({ commit }, id) {
      commit('DECREMENT_ITEM', id)
    },
    removeFromCart({ commit }, cartItemId) {
      commit('REMOVE_ITEM', cartItemId)
    },
    clearCart({ commit }) {
      commit('CLEAR_CART')
    },
  }
}