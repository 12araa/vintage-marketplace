<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errorMsg = ref(null)

const handleLogin = async () => {
  try {
    await store.dispatch('auth/login', form)
    router.push('/')
  } catch (err) {
    errorMsg.value = err.message.replace('Firebase: ', '')
  }
}
</script>

<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="card shadow-sm border-0 p-4" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h4 class="card-title fw-bold mb-4">Login to Vintage</h4>
        <p class="text-muted mb-4">Enter your details below</p>

        <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Email <span class="text-danger">*</span></label>
            <input v-model="form.email" type="email" class="form-control" placeholder="Enter your email" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Password <span class="text-danger">*</span></label>
            <input v-model="form.password" type="password" class="form-control" placeholder="Enter your password" required>
          </div>

          <button type="submit" class="btn btn-success w-100 py-2 mt-3">Continue</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
}
</style>