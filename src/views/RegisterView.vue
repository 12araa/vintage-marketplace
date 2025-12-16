<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const form = reactive({
  fullname: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAgreed: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleRegister = async () => {
  if (!form.isAgreed) {
    alert("Please agree to the terms.")
    return
  }
  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match!")
    return
  }

  try {
    await store.dispatch('register', {
        email: form.email,
        password: form.password,
        fullname: form.fullname,
				username: form.username
    })

    alert("Registration Successful!") 
    router.push('/') 

  } catch (error) {
    alert("Failed: " + error.message)
  }
}
</script>

<template>
  <div class="register-container d-flex justify-content-center align-items-center">
    <div class="card shadow-sm border-0 p-4" style="width: 100%; max-width: 450px;">
      <div class="card-body">
        
        <h4 class="card-title fw-bold mb-2">Sign up</h4>
        <p class="text-muted mb-4">Enter your details below</p>

        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label class="form-label">Full Name <span class="text-danger">*</span></label>
            <input v-model="form.fullname" type="text" class="form-control" placeholder="Enter your fullname" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Username <span class="text-danger">*</span></label>
            <input v-model="form.username" type="text" class="form-control" placeholder="Enter your username" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Email <span class="text-danger">*</span></label>
            <input v-model="form.email" type="email" class="form-control" placeholder="Enter your email" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Password <span class="text-danger">*</span></label>
            <div class="input-group">
              <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="form-control border-end-0" placeholder="Enter your password" required>
              <span class="input-group-text bg-white border-start-0 cursor-pointer" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
              </span>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Confirmation Password <span class="text-danger">*</span></label>
            <div class="input-group">
              <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" class="form-control border-end-0" placeholder="Enter your password" required>
              <span class="input-group-text bg-white border-start-0 cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
              </span>
            </div>
          </div>

          <div class="mb-4 form-check">
            <input v-model="form.isAgreed" type="checkbox" class="form-check-input" id="agreeCheck">
            <label class="form-check-label small text-muted" for="agreeCheck">
              By clicking sign up, I here by agree and consent to <a href="#" class="text-decoration-none">Term & Conditions</a>; I confirm that I have read <a href="#" class="text-decoration-none">Privacy policy</a>.
            </label>
          </div>

          <button type="submit" class="btn btn-success w-100 py-2">Sign up</button>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: calc(100vh - 160px); 
  background-color: #fff;
  padding: 2rem 0;
}

.cursor-pointer {
  cursor: pointer;
}
</style>