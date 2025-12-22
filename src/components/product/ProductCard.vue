<script setup>
import { defineProps } from 'vue'
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
})
const store = useStore();
const likeCount = ref(props.product.likeCount ||0);
const isLiked = ref(false);
const loadingLike = ref(false); 

watch(() => props.product, (newVal) => {
  if (newVal) {
    likeCount.value = newVal.likeCount || 0;
  }
}, { immediate: true });

const checkUserLiked = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const docRef = doc(db, "users", user.uid, "wishlist", props.product.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      isLiked.value = true; 
    }
  } catch (error) {
    console.error("Error checking wishlist status", error);
  }
};

const handleWishlist = async () => {
  if (loadingLike.value) return; 
  const previousState = isLiked.value;
  const previousCount = likeCount.value;

  if (isLiked.value) {
    isLiked.value = false;
    likeCount.value--; 
  } else {
    isLiked.value = true;
    likeCount.value++;
  }

  loadingLike.value = true;

  try {
    const result = await store.dispatch('product/toggleWishlist', props.product);
    if (result === false) {
      isLiked.value = previousState;
      likeCount.value = previousCount;
    }

  } catch (error) {
    console.error("Gagal update wishlist:", error);
    isLiked.value = previousState;
    likeCount.value = previousCount;
  } finally {
    loadingLike.value = false;
  }
};

onMounted(() => {
  checkUserLiked();
});

const formatCurrency = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}
</script>

<template>
  <div class="card h-100 border-0 shadow-sm product-card">
    
    <router-link :to="'/product/' + product.id" class="text-decoration-none text-dark">
      
      <div class="position-relative mb-2 bg-light rounded overflow-hidden" style="height: 220px;">
         <img :src="product.image" @error="handleImageError" class="card-img-top rounded" :alt="product.name" style="height: 220px; object-fit: cover;" >
      </div>

      <div class="card-body px-2 pt-0">
        <h5 class="card-title fw-bold text-success mb-1" style="font-size: 1rem;">{{ formatCurrency(product.price) }}</h5>
        <p class="card-text text-muted mb-1 text-truncate">{{ product.name }}</p>
        <div class="d-flex justify-content-between align-items-center small text-muted">
          <span>{{ product.size }} / {{ product.brand }}</span>
          <button 
            @click.prevent="handleWishlist" 
            class="absolute bottom-2 right-2 bg-white p-2 rounded-full hover:bg-gray-50 transition border-0 d-flex align-items-center justify-content-center"
            :class="{ 'text-danger': isLiked, 'text-muted': !isLiked }"
            style="height: 35px; min-width: 60px;" 
          >
            <i class="bi" :class="isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'" style="font-size: 1rem;"></i>
            
            <span 
              class="text-xs fw-bold text-dark ms-2" 
              style="min-width: 20px; text-align: center; display: inline-block;"
            >
              {{ likeCount }}
            </span>
          </button>
          </div>
        </div>

    </router-link> 
  </div>
</template>

<style scoped>
.text-success { color: #008080 !important; }
.text-danger { color: #dc3545 !important; }
.product-card:hover {
  transform: translateY(-5px);
  transition: transform 0.2s ease;
}
</style>