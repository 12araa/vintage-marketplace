<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  visible: Boolean,
  orderId: String
})

const emit = defineEmits(['close', 'toHistory'])
</script>

<template>
  <div v-if="visible" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4 text-center">
        
        <div class="modal-body">
          <div class="mb-4">
             <i class="bi bi-receipt text-success" style="font-size: 4rem;"></i>
          </div>

          <h4 class="fw-bold mb-2">Order #{{ orderId }} placed successfully</h4>
          
          <p class="text-muted small mb-4">
             Thank you for do online shopping at Vintage. <br>
             You can track and see your order on transaction history menu.
          </p>

          <div class="d-grid gap-2">
            <button @click="$emit('close')" class="btn btn-outline-dark rounded-pill">Continue shopping</button>
            <button @click="$emit('toHistory')" class="btn btn-success rounded-pill text-white" style="background-color: #008080; border:none;">Go to History Transaction</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>