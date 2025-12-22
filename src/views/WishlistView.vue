<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import ProductCard from '@/components/product/ProductCard.vue';

const wishlistProducts = ref([]);
const loading = ref(true);

const fetchWishlist = async () => {
const user = auth.currentUser;

if (!user) {
loading.value = false;
return;
}

try {
const wishlistRef = collection(db, "users", user.uid, "wishlist");
const wishlistSnap = await getDocs(wishlistRef);

if (wishlistSnap.empty) {
	wishlistProducts.value = [];
	loading.value = false;
	return;
}

const productPromises = wishlistSnap.docs.map(async (wishlistDoc) => {
	const productId = wishlistDoc.id;
	const productRef = doc(db, "products", productId);
	const productSnap = await getDoc(productRef);

	if (productSnap.exists()) {
		return { id: productSnap.id, ...productSnap.data() };
	} else {
		return null; 
	}
});

const results = await Promise.all(productPromises);

wishlistProducts.value = results.filter(p => p !== null);

} catch (error) {
console.error("Error fetching wishlist:", error);
} finally {
loading.value = false;
}
};

const removeLocalItem = (id) => {
wishlistProducts.value = wishlistProducts.value.filter(p => p.id !== id);
};

onMounted(() => {
fetchWishlist();
});
</script>
<template>
  <div class="wishlist-page container py-5">
    <h2 class="fw-bold mb-4">My Wishlist</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="wishlistProducts.length === 0" class="text-center py-5 bg-light rounded">
      <i class="bi bi-heart display-1 text-muted mb-3"></i>
      <h4 class="text-muted">Your wishlist is empty</h4>
      <p class="text-muted mb-4">Save items you love to buy them later.</p>
      <router-link to="/products" class="btn btn-primary">Start Shopping</router-link>
    </div>

    <div v-else class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
      <div class="col" v-for="product in wishlistProducts" :key="product.id">
        <ProductCard 
          :product="product" 
          @remove-from-wishlist="removeLocalItem"
        />
      </div>
    </div>

  </div>
</template>
