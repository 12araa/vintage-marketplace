import { auth, db } from '../../firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default {
  namespaced: true,

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
        const user = userCredential.user

        await updateProfile(user, { displayName: fullname })

        await setDoc(doc(db, "users", user.uid), {
          fullname, username, email, role: 'user', createdAt: new Date()
        });

        commit('SET_USER', user)
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
      onAuthStateChanged(auth, (user) => {
        commit('SET_USER', user)
        commit('SET_AUTH_IS_READY', true)
      })
    }
  }
}