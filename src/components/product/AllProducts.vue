<script setup>
import { computed, onMounted, ref, watch } from 'vue'; 
import { useRoute, useRouter } from 'vue-router'; 
import { useStore } from 'vuex';
import ProductCard from './ProductCard.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);

const currentPage = ref(1);
const itemsPerPage = 20;

const searchQuery = computed(() => route.query.q || '');
const brandFilter = computed(() => route.query.brand || '');
const sortFilter  = computed(() => route.query.sort || '');

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
  scrollToTop();
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
  scrollToTop();
};

const goToPage = (page) => {
  currentPage.value = page;
  scrollToTop();
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch([searchQuery, brandFilter, sortFilter], () => {
  currentPage.value = 1;
});

const storeProducts = computed(() => {
  return store.getters['product/allProductsSorted'] || store.getters['allProductsSorted'] || [];
});

const filteredProducts = computed(() => {
  let tempProducts = [...storeProducts.value]; 

  if (sortFilter.value === 'newest') {
    tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  else if (sortFilter.value === 'popular') {
    tempProducts.sort((a, b) => {
      return (b.likeCount || 0) - (a.likeCount || 0); 
    });
  }

  if (brandFilter.value) {
    tempProducts = tempProducts.filter(p => p.brand === brandFilter.value);
  }
  if (searchQuery.value) {
    tempProducts = tempProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return tempProducts;
});

const clearSearch = () => {
  router.push({ name: 'products' });
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.dispatch('product/fetchProducts');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container py-5">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Items</h2>
      
      <div v-if="searchQuery" class="d-flex align-items-center">
        <span class="badge bg-white text-dark border rounded-pill px-3 py-2 d-flex align-items-center shadow-sm">
          {{ searchQuery }}
          <button @click="clearSearch" class="btn-close btn-close-black ms-2" style="width: 0.5em; height: 0.5em;" aria-label="Close"></button>
        </span>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
      <div class="mb-3">
        <i class="bi bi-bag-x-fill display-1 text-muted"></i>
      </div>
      <h3 class="text-muted">Product not found</h3>
      <h5 class="text-muted">We cannot find what you looking for "{{ searchQuery }}".</h5>
      <button @click="clearSearch" class="btn btn-outline-dark mt-2 btn-sm">Reset Keyword</button>
    </div>

    <div v-else class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
      <div class="col" v-for="item in paginatedProducts" :key="item.id">
        <ProductCard :product="item" />
      </div>
    </div>

    <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center mt-5 gap-2">
      <button 
        @click="prevPage" 
        class="btn btn-outline-dark btn-sm"
        :disabled="currentPage === 1"
      >
        <i class="bi bi-chevron-left"></i> Prev
      </button>

      <span class="small text-muted fw-bold mx-2">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button 
        @click="nextPage" 
        class="btn btn-outline-dark btn-sm"
        :disabled="currentPage === totalPages"
      >
        Next <i class="bi bi-chevron-right"></i>
      </button>

    </div>

  </div>
</template>

<style scoped>
.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}
</style>