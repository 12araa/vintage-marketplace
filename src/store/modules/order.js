import { db } from '@/firebase' 
import { collection, addDoc } from 'firebase/firestore' 

export default {
  namespaced: true,

  state: {
    orders: []
  },

  actions: {
    async saveOrder({ commit, rootState }, orderData) {
      try {
        const userId = rootState.auth.user ? rootState.auth.user.uid : 'GUEST'

        const finalOrderData = {
          ...orderData,
          userId: userId,
          createdAt: new Date().toISOString()
        }

				const docRef = await addDoc(collection(db, "orders"), finalOrderData)
        console.log("Order berhasil disimpan ke Firestore! ID Dokumen: ", docRef.id)
        return docRef.id 

      } catch (error) {
        console.error("Gagal menyimpan order: ", error)
        throw error
      }
    }
  }
}