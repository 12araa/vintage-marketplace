<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'

const store = useStore()
const allProducts = computed(() => store.state.product.products)
const cartItems = computed(() => store.state.cart.cart)

onMounted(() => {
  store.dispatch('product/fetchProducts')
})

const otherProducts = computed(() => {
  if (!allProducts.value.length) return []
  return allProducts.value
    .filter(product => !cartItems.value.some(cartItem => cartItem.id === product.id))
    .sort(() => 0.5 - Math.random()) 
    .slice(0, 4) 
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const totalShipping = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.shipping || 0)
  }, 0)
})

const grandTotal = computed(() => {
  return subtotal.value + totalShipping.value
})

const increaseQty = (item) => store.dispatch('cart/addToCart', item) 
const decreaseQty = (id) => store.dispatch('cart/decreaseQty', id)
const removeItem = (id) => store.dispatch('cart/removeFromCart', id)

const formatCurrency = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0)
}

</script>

<template>
  <div class="cart-page container py-3">
    
    <h2 class="fw-bold mb-4">Shopping Cart</h2>

    <div v-if="cartItems.length === 0" class="text-center py-5">
      <div class="mb-3">
        <i class="bi bi-cart-x text-muted" style="font-size: 4rem;"></i>
      </div>
      <h4 class="text-muted">Your cart is empty</h4>
      <router-link to="/" class="btn btn-success mt-3 px-4 py-2" style="background-color: #008080;">
        Start Shopping
      </router-link>
    </div>

    <div v-else class="row">
      
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            
            <div v-for="item in cartItems" :key="item.id" class="row mb-4 border-bottom pb-4 align-items-center">
              
              <div class="col-md-2 col-4">
                <img :src="item.image" class="img-fluid rounded" :alt="item.name">
              </div>

              <div class="col-md-6 col-8">
                <h6 class="fw-bold mb-1">{{ item.name }}</h6>
                <small class="text-muted d-block">Size: {{ item.size }}</small>
                <small class="text-muted d-block">Condition: {{ item.condition }}</small>
								<small class="text-muted d-block">
                    Shipping: {{ formatCurrency(item.shipping) }}
                </small>
              </div>

              <div class="col-md-3 col-6 mt-3 mt-md-0 align-items-center">
								<div class="d-flex">
									<button @click="decreaseQty(item.id)" class="btn btn-sm btn-outline-secondary px-2" :disabled="item.quantity <= 1">-</button>
									<span class="mx-3 fw-bold">{{ item.quantity }}</span>
									<button @click="increaseQty(item)" class="btn btn-sm btn-outline-secondary px-2">+</button>
									<div class="fw-bold text-success mb-2 mx-3">{{ formatCurrency(item.price * item.quantity) }}</div>
								</div>
								 <div class="col-md-2 col-6 mt-3 mt-md-0 text-start">
									 <button @click="removeItem(item.id)" class="btn btn-link text-danger mt-3 mx-5 p-0 d-flex text-decoration-none ">
										 <i class="bi bi-trash"></i> Remove
									 </button>
								 </div>
							</div>


            </div>

          </div>
        </div>
      </div>

      <div class="col-lg-4 mt-4 mt-lg-0">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Order Summary</h5>
            
           	<div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold">{{ formatCurrency(subtotal) }}</span>
            </div>
            
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Shipping</span>
              <span class="fw-bold">{{ formatCurrency(totalShipping) }}</span>
            </div>
            
            <hr>
            
            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">Total</span>
              <span class="fw-bold fs-5 text-success">{{ formatCurrency(grandTotal) }}</span>
            </div>

            <div class="d-grid">
              <router-link to="/order-confirmation" class="btn btn-success py-2 fw-bold w-100" style="background-color: #008080; border:none;">
									Proceed to Checkout
							</router-link>
            </div>
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
</template>