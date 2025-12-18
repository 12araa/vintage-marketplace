<script setup>
import { onMounted, computed, watch } from 'vue'
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
const allProducts = computed(() => store.state.product.products)
const loading = computed(() => !product.value)

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

const loadProduct = async (id) => {
  await store.dispatch('product/fetchProductById', id)
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

onMounted(() => {
  loadProduct(route.params.id)
})

watch(() => route.params.id, (newId) => {
  loadProduct(newId)
  window.scrollTo(0, 0) 
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
            <p class="text-muted small mb-0">
               {{ product.size }} / {{ product.condition }} / Denpasar
            </p>
          </div>

          <div class="mb-4">
            <h6 class="fw-bold text-success">Item Description</h6>
            <p class="text-muted small" style="line-height: 1.6;">
              {{ product.description || 'No description available for this item.' }}
            </p>
          </div>

          <div class="mb-4">
            <div class="row mb-2">
              <div class="col-4 text-muted small">Category</div>
              <div class="col-8 small fw-medium text-capitalize">{{ product.category }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted small">Size</div>
              <div class="col-8 small fw-medium">{{ product.size }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted small">Condition</div>
              <div class="col-8 small fw-medium">{{ product.condition }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted small">Color</div>
              <div class="col-8 small fw-medium">{{ product.color }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted small">Uploaded</div>
              <div class="col-8 small fw-medium">5 hours ago</div> </div>
            <div class="row mb-2">
              <div class="col-4 text-muted small">Shipping</div>
              <div class="col-8 small fw-medium">{{ formatCurrency(product.shipping) }}</div>
            </div>
          </div>

          <div class="d-grid gap-2 mb-4">
            <button class="btn btn-success text-white py-2 fw-bold" style="background-color: #008080; border: none;">
              Buy Now
            </button>
            <button @click="handleAddToCart" class="btn btn-outline-success py-2 fw-bold" style="color: #008080; border-color: #008080;">
              Add to Cart
            </button>
          </div>

          <div class="card border-0 shadow-sm p-3 d-flex flex-row align-items-center bg-light">
             <img src="https://ui-avatars.com/api/?name=Jack+Corner&background=random" class="rounded-circle me-3" width="50" height="50">
             <div>
               <h6 class="fw-bold mb-0 text-dark">{{ product.seller || 'Seller Name' }}</h6>
               <small class="text-warning">
                 <i class="bi bi-star-fill"></i>
                 <i class="bi bi-star-fill"></i>
                 <i class="bi bi-star-fill"></i>
                 <i class="bi bi-star-fill"></i>
                 <i class="bi bi-star-fill"></i>
                 <span class="text-muted ms-1">(110)</span>
               </small>
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
</style>