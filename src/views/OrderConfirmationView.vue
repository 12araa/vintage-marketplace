<script setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import OrderSuccessModal from '@/components/modal/OrderSuccessModal.vue'

const store = useStore()
const router = useRouter()
const cartItems = computed(() => store.state.cart.cart)
const showModal = ref(false)
const orderId = ref('')
const protectionFee = 20000 

const userAddress = reactive({
  recipientName: '', 
  phone: '',
  fullAddress: ''
})

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const totalShipping = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.shipping || 0), 0)
})

const grandTotal = computed(() => {
  return subtotal.value + totalShipping.value + protectionFee
})

const formatCurrency = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0)
}

const handleOrder = () => {
  if (!userAddress.recipientName || !userAddress.fullAddress || !userAddress.phone) {
    alert("Please fill in the shipping address completely.")
    return
  }
  const randomNum = Math.floor(10000 + Math.random() * 90000)
  orderId.value = `ORD-${randomNum}-823`
  console.log("Mengirim barang ke:", userAddress)

  store.dispatch('cart/clearCart')
  showModal.value = true
}

const handleContinue = () => {
  showModal.value = false
  router.push('/')
}

const handleHistory = () => {
  showModal.value = false
  router.push('/') 
}

onMounted(() => {
  const user = store.state.auth.user
  if (user) {
    userAddress.recipientName = user.displayName || 'User'
  }
  if (cartItems.value.length === 0 && !showModal.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="order-confirmation-page container py-5">
    
    <h2 class="fw-bold mb-4">Order Confirmation</h2>

    <div class="row">
      <div class="col-lg-8">
        
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
             <h6 class="fw-bold mb-3">Order</h6>
             <div v-for="item in cartItems" :key="item.id" class="d-flex align-items-center mb-3">
                <img :src="item.image" class="rounded me-3" width="60" height="60" style="object-fit: cover;">
                <div class="flex-grow-1">
                   <h6 class="mb-0 fw-bold">{{ item.name }}</h6>
                   <small class="text-muted">{{ item.size }} / {{ item.condition }}</small><br>
                   <small class="fw-bold text-success">{{ formatCurrency(item.price) }}</small>
                </div>
                <div class="fw-bold">x{{ item.quantity }}</div>
             </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
             <h6 class="fw-bold mb-3">Address</h6>
             <form>
								<div class="mb-3">
									<label class="form-label small text-muted">Recipient Name</label>
									<input v-model="userAddress.recipientName" type="text" class="form-control" placeholder="Enter recipient name">
								</div>
								
								<div class="mb-3">
									<label class="form-label small text-muted">Phone Number</label>
									<input v-model="userAddress.phone" type="tel" class="form-control" placeholder="e.g. 08123456789">
								</div>

								<div class="mb-3">
									<label class="form-label small text-muted">Full Address</label>
									<textarea v-model="userAddress.fullAddress" class="form-control" rows="3" placeholder="Enter your full shipping address"></textarea>
								</div>
						</form>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
             <h6 class="fw-bold mb-3">Delivery details</h6>
             <div class="d-flex align-items-center border p-3 rounded">
                <i class="bi bi-shield-check text-success fs-4 me-3"></i>
                <div>
                   <h6 class="fw-bold mb-0">Fedex Express Shipping</h6>
                   <small class="text-muted">Rp 20.000 (Included)</small> <br>
                   <small class="text-muted"><i class="bi bi-clock"></i> Home delivery in 1-3 working days</small>
                </div>
             </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
           <div class="card-body p-4">
             <h6 class="fw-bold mb-3">Payment Method</h6>
             <div class="d-flex align-items-center border p-3 rounded">
                <i class="bi bi-credit-card-2-front text-primary fs-3 me-3"></i>
                <div>
                   <h6 class="fw-bold mb-0">0819283210323</h6>
                   <small class="text-muted">23/12 • 123</small><br>
                   <small class="text-muted">Jack Daniel Arya</small>
                </div>
             </div>
           </div>
        </div>

      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
           <div class="card-body p-4">
              <h6 class="fw-bold mb-3">Order summary</h6>
              
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">Order</span>
                <span class="fw-bold">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">Protection fee</span>
                <span class="fw-bold">{{ formatCurrency(protectionFee) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2 small">
                <span class="text-muted">Shipping</span>
                <span class="fw-bold">{{ formatCurrency(totalShipping) }}</span>
              </div>
              
              <hr>

              <div class="d-flex justify-content-between mb-4">
                <span class="fw-bold">Total to pay</span>
                <span class="fw-bold text-success fs-5">{{ formatCurrency(grandTotal) }}</span>
              </div>

              <div class="d-grid">
                <button @click="handleOrder" class="btn btn-success py-2 fw-bold" style="background-color: #008080; border:none;">
                  Order Now
                </button>
              </div>

           </div>
        </div>
      </div>

    </div>

    <OrderSuccessModal 
      :visible="showModal" 
      :orderId="orderId"
      @close="handleContinue"
      @toHistory="handleHistory"
    />

  </div>
</template>