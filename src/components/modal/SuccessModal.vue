<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  visible: Boolean,
  product: Object
})

const emit = defineEmits(['close', 'toCart'])
</script>

<template>
  <div v-if="visible" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3 text-center">
        
        <div class="modal-body">
          <div class="mb-3">
             <div class="rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 60px; height: 60px; background-color: #FFF3CD;">
              <i class="bi bi-cart-check text-warning fs-2"></i>
            </div>
          </div>

          <h5 class="fw-bold mb-2">Product successfully added to cart.</h5>
          <p class="text-muted small mb-4">“{{product?.name}}” successfully added to cart. Check now on the cart or continue shopping.</p>

          <div class="d-grid gap-2">
            <button @click="$emit('close')" class="btn btn-outline-dark rounded-pill">Continue shopping</button>
            <button @click="$emit('toCart')" class="btn btn-success rounded-pill text-white" style="background-color: #008080; border:none;">Go to cart</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>