<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

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
          <span><i class="bi bi-heart"></i> 12</span>
          </div>
        </div>

    </router-link> 
  </div>
</template>

<style scoped>
.text-success { color: #008080 !important; }
.product-card:hover {
  transform: translateY(-5px);
  transition: transform 0.2s ease;
}
</style>