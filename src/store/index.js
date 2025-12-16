import { createStore } from 'vuex'
import { auth, db } from '../firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export default createStore({
  state: {
    user: null, 
    authIsReady: false 
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_AUTH_IS_READY(state, payload) {
      state.authIsReady = payload
    }
  },
  actions: {
    async register({ commit }, details) {
      const { email, password, fullname, username } = details
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullname, username, email, role: 'user', createdAt: new Date()
        });
        commit('SET_USER', userCredential.user)
      } catch (error) {
        throw error
      }
    },

    async login({ commit }, details) {
      const { email, password } = details
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        commit('SET_USER', userCredential.user)
      } catch (error) {
        throw error
      }
    },

    async logout({ commit }) {
      await signOut(auth)
      commit('SET_USER', null)
    },
    
    fetchUser({ commit }) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          commit('SET_USER', user)
        } else {
          commit('SET_USER', null)
        }
        commit('SET_AUTH_IS_READY', true)
      })
    }
  }
})