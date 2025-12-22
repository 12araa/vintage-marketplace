<script setup>
import { onMounted, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router' 
import { useStore } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'
import StoreAlert from '@/components/modal/SuccessModal.vue'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter() 
const store = useStore()
const showSuccessModal = ref(false)

const product = computed(() => store.state.product.product)
const reviews = computed(() => store.state.product.reviews)
const allProducts = computed(() => store.state.product.products)
const loading = computed(() => !product.value)

const isLoggedIn = computed(() => store.state.auth.user !== null)
const hasPurchased = ref(false)

const userHasReviewed = computed(() => {
  if (!isLoggedIn.value || !reviews.value.length) return false;
  return reviews.value.some(review => review.userId === user.value.uid);
})

const otherProducts = computed(() => {
  if (!allProducts.value.length) return []
  return allProducts.value
    .filter(p => p.id !== product.value?.id) 
    .sort(() => 0.5 - Math.random()) 
    .slice(0, 4) 
})

const formatCurrency = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0)
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

const loadProduct = async (id) => {
  await store.dispatch('product/fetchProductById', id)
  await store.dispatch('product/fetchReviews', id)
  if (isLoggedIn.value) {
    hasPurchased.value = await store.dispatch('product/checkUserPurchase', id)
  }
  if (store.state.product.products.length === 0) {
    await store.dispatch('product/fetchProducts')
  }
}

const handleAddToCart = () => {
  if (product.value) {
    store.dispatch('cart/addToCart', product.value)
    showSuccessModal.value = true 
  }
}

const handleContinue = () => {
  showSuccessModal.value = false
}
const handleToCart = () => {
  showSuccessModal.value = false
  router.push('/cart')
}

const reviewForm = reactive({ rating: 0, comment: '' })
const isSubmitting = ref(false)

const setRating = (star) => { reviewForm.rating = star }

const submitReview = async () => {
  if (reviewForm.rating === 0) {
    alert("Please select a star rating first.")
    return
  }
  isSubmitting.value = true
  try {
    await store.dispatch('product/addReview', {
      productId: product.value.id,
      reviewData: { rating: reviewForm.rating, comment: reviewForm.comment }
    })
    alert("Review submitted successfully!")
    reviewForm.rating = 0
    reviewForm.comment = ''
    
    await loadProduct(product.value.id)

  } catch (error) {
    console.error(error)
    alert("Failed to submit review.")
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadProduct(route.params.id)
})

watch(() => route.params.id, (newId) => {
  loadProduct(newId)
  window.scrollTo(0, 0) 
})

watch(isLoggedIn, async (newVal) => {
  if (newVal && product.value) {
    hasPurchased.value = await store.dispatch('product/checkUserPurchase', product.value.id)
  } else {
    hasPurchased.value = false
  }
})


</script>

<template>
	<div class="product-detail-page">
    <StoreAlert 
      :visible="showSuccessModal" 
      :product="product"
      @close="handleContinue"
      @toCart="handleToCart"
    />

  </div>
  <div class="product-detail-page">
    
    <div v-if="loading" class="text-center py-5 my-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="container py-5">

      <div class="row mb-5">
        
        <div class="col-lg-7 mb-4">
          <div class="card border-0 rounded-3 overflow-hidden shadow-sm">
            <img :src="product.image" class="img-fluid w-100" style="object-fit: cover; max-height: 600px;" :alt="product.name">
          </div>
        </div>

        <div class="col-lg-5 ps-lg-4">
          
          <div class="mb-4 border-bottom pb-4">
            <div class="d-flex justify-content-between align-items-start">
               <h2 class="fw-bold mb-2 display-6">{{ formatCurrency(product.price) }}</h2>
               <button class="btn btn-outline-secondary rounded-circle p-2 border-0 bg-light">
                 <i class="bi bi-heart fs-5"></i>
               </button>
            </div>
            <h5 class="text-dark fw-normal mb-2">{{ product.name }}</h5>
            <div class="mb-2 text-warning small" v-if="product.reviewCount > 0">
               <span class="fw-bold text-dark me-1">{{ parseFloat(product.averageRating).toFixed(1) }}</span>
               <i class="bi bi-star-fill"></i>
               <span class="text-muted ms-1">({{ product.reviewCount }} reviews)</span>
            </div>
            <p class="text-muted small mb-0">{{ product.size }} / {{ product.condition }} / Denpasar</p>
          </div>

          <div class="mb-4">
            <h6 class="fw-bold text-success">Item Description</h6>
            <p class="text-muted small" style="line-height: 1.6;">{{ product.description }}</p>
          </div>

          <div class="d-grid gap-2 mb-4">
            <button class="btn btn-success text-white py-2 fw-bold" style="background-color: #008080; border: none;">Buy Now</button>
            <button @click="handleAddToCart" class="btn btn-outline-success py-2 fw-bold" style="color: #008080; border-color: #008080;">Add to Cart</button>
          </div>

          <div class="card border-0 shadow-sm p-3 d-flex flex-row align-items-center bg-light">
             <img src="https://ui-avatars.com/api/?name=Jack+Corner&background=random" class="rounded-circle me-3" width="50" height="50">
             <div>
               <h6 class="fw-bold mb-0 text-dark">{{ product.seller || 'Seller Name' }}</h6>
               <h6 class="mt-1 mb-3">Reviews ({{ reviews.length }})</h6>
             </div>
          </div>

          <div class="reviews-section">
            <div v-if="isLoggedIn && hasPurchased && userHasReviewed" class="card border-0 shadow-sm p-4 mb-4 bg-light">
              <h6 class="fw-bold mb-2 small">Write your review</h6>
              <form @submit.prevent="submitReview">
                <div class="mb-2">
                  <div class="d-flex gap-1">
                    <i v-for="star in 5" :key="star" @click="setRating(star)" class="bi fs-5 cursor-pointer" :class="star <= reviewForm.rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"></i>
                  </div>
                </div>
                <div class="mb-2">
                  <textarea v-model="reviewForm.comment" class="form-control form-control-sm" rows="2" placeholder="Share your experience..."></textarea>
                </div>
                <button type="submit" class="btn btn-sm btn-dark w-100" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Sending...' : 'Post Review' }}
                </button>
              </form>
            </div>

            <div v-if="reviews.length > 0" class="review-list">
              <div v-for="review in reviews" :key="review.id" class="border-bottom pb-3 my-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <div class="d-flex align-items-center gap-2">
                    <img :src="review.userPhoto || 'https://ui-avatars.com/api/?name=' + review.userName + '&background=random'" class="rounded-circle" width="30" height="30">
                    <span class="fw-bold small">{{ review.userName }}</span>
                  </div>
                  <small class="text-muted" style="font-size: 0.7rem;">{{ formatDate(review.createdAt) }}</small>
                </div>
                <div class="mb-1">
                  <i v-for="n in 5" :key="n" class="bi" :class="n <= review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'" style="font-size: 0.8rem;"></i>
                </div>
                <p class="text-muted small mb-0">{{ review.comment }}</p>
              </div>
            </div>

            <div v-else class="text-center py-4 bg-light rounded">
              <p class="text-muted small mb-0">No reviews yet</p>
            </div>
          </div>
          </div>
      </div>

      <div class="mt-5 pt-4 border-top">
        <h4 class="fw-bold mb-4">Other Product</h4>
        <div class="row g-4">
          <div v-for="item in otherProducts" :key="item.id" class="col-6 col-md-3">
             <ProductCard :product="item" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.text-success { color: #008080 !important; }
.cursor-pointer { cursor: pointer; }
</style>