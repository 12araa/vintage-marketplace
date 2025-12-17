<script setup>
import { defineProps } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'

defineProps({
  title: String,
  items: Array 
})
</script>

<template>
  <section class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">{{ title }}</h4>
      <a href="#" class="text-success text-decoration-none small fw-bold">See all</a>
    </div>

    <div class="row g-4">
      <div v-for="item in items" :key="item.id" class="col-6 col-md-3">
        <ProductCard :product="item" />
      </div>
    </div>
  </section>
</template>