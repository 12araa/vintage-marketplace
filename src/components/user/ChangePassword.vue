<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

const store = useStore()
const router = useRouter()

// State Form
const oldPassword = ref('') 
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)

// State Alert
const alertMessage = ref('')
const alertType = ref('success') 
const showAlert = ref(false)

const handleChangePassword = async () => {
  if (newPassword.value.length < 6) {
    showAlertMessage("New password must be at least 6 characters.", "danger")
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showAlertMessage("New passwords do not match.", "danger")
    return
  }

  loading.value = true
  const user = store.state.auth.user

  if (user) {
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword.value)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword.value)
      showAlertMessage("Password updated successfully!", "success")
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

    } catch (error) {
      console.error(error)
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        showAlertMessage("The old password you entered is incorrect.", "danger")
      } else if (error.code === 'auth/too-many-requests') {
         showAlertMessage("Too many attempts. Please try again later.", "danger")
      } else {
        showAlertMessage("Failed to update password. " + error.message, "danger")
      }
    } finally {
      loading.value = false
    }
  }
}

const showAlertMessage = (message, type) => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true
  setTimeout(() => showAlert.value = false, 4000)
}
</script>

<template>
  <div class="change-password">
    
    <h5 class="fw-bold mb-4">Change Password</h5>

    <div v-if="showAlert" :class="`alert alert-${alertType} alert-dismissible fade show`" role="alert">
      {{ alertMessage }}
      <button type="button" class="btn-close" @click="showAlert = false"></button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        
        <form @submit.prevent="handleChangePassword">
          
          <div class="mb-3">
            <label class="form-label small text-muted fw-bold">Old Password</label>
            <input 
              v-model="oldPassword" 
              type="password" 
              class="form-control" 
              placeholder="Enter old password"
              required
            >
          </div>

          <hr class="my-4">

          <div class="mb-3">
            <label class="form-label small text-muted">New Password</label>
            <input 
              v-model="newPassword" 
              type="password" 
              class="form-control" 
              placeholder="Enter new password"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label small text-muted">Confirm New Password</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              class="form-control" 
              placeholder="Confirm new password"
              required
            >
          </div>

          <div class="mt-4 text-end">
             <button type="submit" class="btn btn-success px-4 py-2 fw-bold" style="background-color: #008080; border:none;" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Updating...' : 'Save Changes' }}
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>