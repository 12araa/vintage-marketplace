<script setup>
import { ref } from 'vue'
const brands = ref(['Vans', 'Bohoo', 'Mango', 'Reebok', 'Converse', 'Sandro', 'Nike', 'Adidas', 'Dior', 'Puma', 'Zara', 'Bershka', 'American Eagle'])
</script>

<template>
  <section class="brand-list py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold text-dark">Shop by brand</h4>
    </div>
    <div class="d-flex flex-wrap gap-2">
      <button v-for="brand in brands" :key="brand" 
              class="btn btn-outline-secondary rounded-0 px-4 py-2 brand-btn">
        {{ brand }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.brand-btn {
  font-size: 0.85rem; 
  border-color: #eee; 
  color: #555;
  background-color: white;
}
.brand-btn:hover {
  border-color: #008080;
  color: #008080;
}
</style>