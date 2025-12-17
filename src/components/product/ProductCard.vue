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
    <div class="position-relative mb-2">
       <img :src="product.image" class="card-img-top rounded" :alt="product.name" style="height: 220px; object-fit: cover;">
       <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm p-1" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
         <i class="bi bi-heart text-danger" style="font-size: 0.8rem;"></i>
       </button>
    </div>
    <div class="card-body px-2 pt-0">
      <h5 class="card-title fw-bold text-success mb-1" style="font-size: 1rem;">{{ formatCurrency(product.price) }}</h5>
      <p class="card-text text-muted mb-1 text-truncate" style="font-size: 0.9rem;">{{ product.name }}</p>
      <div class="d-flex justify-content-between align-items-center small text-muted">
        <span>{{ product.size }} / {{ product.brand }}</span>
        <span><i class="bi bi-heart"></i> 12</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-success { color: #008080 !important; }
.product-card:hover {
  transform: translateY(-5px);
  transition: transform 0.2s ease;
}
</style>