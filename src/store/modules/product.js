import { db, auth } from '../../firebase'
import { collection, addDoc, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc, increment, query, where, } from 'firebase/firestore'

export default {
  namespaced: true,

  state: {
    products: [],
    product: null,
    wishlistCount: 0,
    reviews: []
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

    allProducts: (state) => state.products,
    getWishlistCount: (state) => state.wishlistCount,
  },

  mutations: {
    SET_PRODUCTS(state, payload) {
      state.products = payload
    },
    SET_PRODUCT(state, payload) { 
      state.product = payload
    },
    SET_WISHLIST_COUNT(state, count) {
      state.wishlistCount = count;
    },
    INCREMENT_WISHLIST(state) {
      state.wishlistCount++;
    },
    DECREMENT_WISHLIST(state) {
      if (state.wishlistCount > 0) state.wishlistCount--;
    },
    SET_REVIEWS(state, payload) {
      state.reviews = payload
    }
  },

  actions: {
    async fetchWishlistCount({ commit }) {
      const user = auth.currentUser;
      if (!user) {
        commit('SET_WISHLIST_COUNT', 0);
        return;
      }
      try {
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        const snapshot = await getDocs(wishlistRef);
        commit('SET_WISHLIST_COUNT', snapshot.size); 
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
      }
    },

    async toggleWishlist({ commit }, product) {
      const user = auth.currentUser;
      if (!user) {
        alert("Silakan login dulu!");
        return false;
      }

      const userId = user.uid;
      const productId = product.id;
      const userWishlistRef = doc(db, "users", userId, "wishlist", productId);
      const productRef = doc(db, "products", productId);

      try {
        const docSnap = await getDoc(userWishlistRef);

        if (docSnap.exists()) {
          await deleteDoc(userWishlistRef);
          await updateDoc(productRef, { likeCount: increment(-1) });

          commit('DECREMENT_WISHLIST'); 
          
          return 'removed';
        } else {
          await setDoc(userWishlistRef, { 
            addedAt: new Date(),
            name: product.name,
            price: product.price
          });
          await updateDoc(productRef, { likeCount: increment(1) });
          
          commit('INCREMENT_WISHLIST'); 

          return 'added';
        }
      } catch (error) {
        console.error("Gagal update wishlist:", error);
        throw error;
      }
    },
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
    },

    async addReview({ commit, state }, { productId, reviewData }) {
      const user = auth.currentUser;
      if (!user) {
        alert("Silakan login untuk memberi review.");
        return false;
      }

      try {
        const reviewRef = collection(db, "products", productId, "reviews");
        await addDoc(reviewRef, {
          userId: user.uid,
          userName: user.displayName || "User",
          userPhoto: user.photoURL || null,
          rating: reviewData.rating, 
          comment: reviewData.comment,
          createdAt: new Date()
        });

        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const product = productSnap.data();
          
          const currentCount = product.reviewCount || 0;
          const currentAvg = product.averageRating || 0;

          const newCount = currentCount + 1;
          const newAvg = ((currentAvg * currentCount) + reviewData.rating) / newCount;

          await updateDoc(productRef, {
            reviewCount: newCount,
            averageRating: newAvg
          });
          
          console.log("Review berhasil & Rating diupdate!");
          return true;
        }
      } catch (error) {
        console.error("Gagal submit review:", error);
        throw error;
      }
    },

    async checkUserPurchase({ rootState }, productId) {
      const user = rootState.auth.user;
      if (!user) return false;

      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        let isPurchased = false;

        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          
          if (orderData.items && Array.isArray(orderData.items)) {
            orderData.items.forEach(item => {
              if (String(item.id) === String(productId) || String(item.productId) === String(productId)) {
                isPurchased = true;
              }
            });
          }
        });
        
        return isPurchased;
      } catch (error) {
        console.error("Error checking purchase history:", error);
        return false;
      }
    },
    async fetchReviews({ commit }, productId) {
      try {
        const reviewsRef = collection(db, "products", productId, "reviews");
        // Urutkan dari yang terbaru (descending)
        // Note: Kalau error "index needed", hapus orderBy sementara
        const q = query(reviewsRef); 
        
        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('SET_REVIEWS', reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
  }
}