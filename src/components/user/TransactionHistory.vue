<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { db } from '@/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

const store = useStore()
const orders = ref([])
const loading = ref(true)

const user = computed(() => store.state.auth.user)

const formatCurrency = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

onMounted(async () => {
  if (!user.value) {
    loading.value = false
    return
  }

  try {
    const q = query(collection(db, "orders"), where("userId", "==", user.value.uid))
    const querySnapshot = await getDocs(q)
    const fetchedOrders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    orders.value = fetchedOrders

  } catch (error) {
    console.error("Error fetching orders:", error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="transaction-history">
    
    <h5 class="fw-bold mb-4">My Order</h5>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-5 border rounded bg-light">
      <div class="mb-3">
        <i class="bi bi-bag-x text-muted" style="font-size: 3rem;"></i>
      </div>
      <h5 class="fw-bold">No orders yet</h5>
      <p class="text-muted small">When you buy an item, your order about it will appear here.</p>
      <router-link to="/" class="btn btn-success rounded-pill px-4 mt-2" style="background-color: #008080; border:none;">
        Shop now
      </router-link>
    </div>

    <div v-else>
      <div v-for="order in orders" :key="order.id" class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <i class="bi bi-bag-check-fill text-success me-2"></i>
              <span class="fw-bold small me-2">Shopping</span>
              <span class="text-muted small">{{ formatDate(order.createdAt) }}</span>
              <span class="badge bg-light text-dark border ms-2 rounded-pill fw-normal">{{ order.status }}</span>
            </div>
            <div class="text-muted small">
              {{ order.id }}
            </div>
          </div>

          <div class="row align-items-center">
            
            <div class="col-md-2 col-3">
              <img :src="order.items[0].image" class="img-fluid rounded" style="object-fit: cover; aspect-ratio: 1/1;">
            </div>

            <div class="col-md-7 col-9">
              <h6 class="fw-bold mb-1">{{ order.items[0].name }}</h6>
              <div class="text-muted small">
                 {{ order.items[0].quantity }} product x {{ formatCurrency(order.items[0].price) }}
              </div>
              
              <div v-if="order.items.length > 1" class="text-muted small mt-1">
                + {{ order.items.length - 1 }} more products
              </div>
            </div>

            <div class="col-md-3 col-12 text-md-end mt-3 mt-md-0">
              <small class="text-muted d-block mb-1">Total Price</small>
              <h6 class="fw-bold mb-3">{{ formatCurrency(order.totalPrice) }}</h6>
              <div class="d-flex flex-row gap-2 justify-content-md-end justify-content-start">
                <router-link 
                  :to="'/product/' + order.items[0].id" 
                  class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                >
                  <i class="bi bi-star"></i> Review
                </router-link>
                <router-link :to="'/product/' + order.items[0].id" class="btn btn-sm btn-outline-success fw-bold" style="color: #008080; border-color: #008080;">
                  Buy Again
                </router-link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>