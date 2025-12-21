import { db } from '../../firebase' // Mundur 2 folder
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

export default {
  namespaced: true,

  state: {
    products: [],
    product: null 
  },

  getters: {
    popularProducts: (state) => {
      return [...state.products]
        .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        .slice(0, 4)
    },
    
    allProductsSorted: (state) => {
      return [...state.products].sort((a, b) => {
        const dateA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return dateB - dateA
      })
    },

    newProducts: (state, getters) => {
      return getters.allProductsSorted.slice(0, 4) 
    },

    allProducts: (state) => state.products
  },

  mutations: {
    SET_PRODUCTS(state, payload) {
      state.products = payload
    },
    SET_PRODUCT(state, payload) { 
      state.product = payload
    }
  },

  actions: {
    async fetchProducts({ commit }) {
      try {
        const querySnapshot = await getDocs(collection(db, "products"))
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        commit('SET_PRODUCTS', products)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    },

    async fetchProductById({ commit }, productId) {
      try {
        const docRef = doc(db, "products", productId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() }
          commit('SET_PRODUCT', data) 
          return data
        } else {
          throw new Error("Product not found")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        throw error
      }
    }
  }
}