<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'

import ProductCard from '@/components/product/ProductCard.vue'
import BrandList from '@/components/product/BrandList.vue'

const store = useStore()

onMounted(() => {
  store.dispatch('product/fetchProducts')
})
const popularProducts = computed(() => store.getters['product/popularProducts'])
const newProducts = computed(() => store.getters['product/newProducts'])
const products = computed(() => store.state.product.products) 
</script>

<template>
  <div class="home-page">
    
    <section class="banner bg-white py-5">
      <div class="container d-flex align-items-center justify-content-between flex-wrap-reverse">
        <div class="banner-text col-lg-5">
          <h1 class="fw-bold display-4 mb-3" style="color: #002d2d;">Ready to declutter <br> your closet?</h1>
          <button class="btn btn-success px-5 py-2 rounded-0" href="HomeView.vue" style="background-color: #008080; border:none;">Shop Now</button>
        </div>
        <div class="col-lg-6 mb-4 mb-lg-0">
             <img src="@/assets/images/Banner.png" class="img-fluid rounded shadow-sm" alt="Banner">
        </div>
      </div>
    </section>

    <section class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold text-dark">Popular items</h4>
        <a href="#" class="text-success text-decoration-none small fw-bold">See all</a>
      </div>

      <div class="row g-4">
        <div v-for="item in popularProducts" :key="item.id" class="col-6 col-md-3">
          <ProductCard :product="item" />
        </div>
      </div>
    </section>

    <div class="container">
      <BrandList />
    </div>

    <section class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold text-dark">New Product</h4>
        <a href="#" class="text-success text-decoration-none small fw-bold">See all</a>
      </div>

      <div class="row g-4">
        <div v-for="item in newProducts" :key="item.id" class="col-6 col-md-3">
           <ProductCard :product="item" />
        </div>
      </div>
    </section>

  </div>
</template>