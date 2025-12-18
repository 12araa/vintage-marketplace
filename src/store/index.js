import { createStore } from 'vuex'

import auth from './modules/auth'
import product from './modules/product'
import cart from './modules/cart'

export default createStore({
  modules: {
    auth,   
    product,
    cart
  }
})