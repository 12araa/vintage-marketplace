<script setup>
import { reactive, onMounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

const store = useStore()
const user = computed(() => store.state.auth.user)
const loading = ref(false)
const showSuccessAlert = ref(false)

const userData = reactive({
  fullname: '',
  email: '', 
  username: '',
})

const loadUserData = async () => {
  if (!user.value) return 

  userData.fullname = user.value.displayName || ''
  userData.email = user.value.email || ''

  try {
    const docRef = doc(db, "users", user.value.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      userData.username = data.username || '' 
    }
  } catch (error) {
    console.error("Gagal mengambil data user:", error)
  }
}

onMounted(() => {
  loadUserData()
})

watch(user, (newUser) => {
  if (newUser) {
    loadUserData()
  }
})

const handleUpdate = async () => {
  loading.value = true
  try {
    if (store.state.auth.user) {
        await updateProfile(store.state.auth.user, {
            displayName: userData.fullname
        })
    }

    await setDoc(doc(db, "users", user.value.uid), {
      username: userData.username,
      fullname: userData.fullname,
      email: userData.email, 
      updatedAt: new Date()
    }, { merge: true })

    showSuccessAlert.value = true
    setTimeout(() => showSuccessAlert.value = false, 3000)

  } catch (error) {
    console.error("Gagal update profile:", error)
    alert("Terjadi kesalahan saat menyimpan data.")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="user-profile">
    
    <h5 class="fw-bold mb-4">Profile Details</h5>

    <div v-if="showSuccessAlert" class="alert alert-success alert-dismissible fade show" role="alert">
      Profile updated successfully!
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        
        <form @submit.prevent="handleUpdate">

          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label small text-muted">Full Name</label>
              <input v-model="userData.fullname" type="text" class="form-control" placeholder="Enter your fullname" required>
            </div>
            
            <div class="col-md-12">
              <label class="form-label small text-muted">Username</label>
              <input v-model="userData.username" type="text" class="form-control" placeholder="Create a username">
            </div>

            <div class="col-md-12">
              <label class="form-label small text-muted">Email</label>
              <input v-model="userData.email" type="email" class="form-control" disabled style="background-color: #e9ecef;">
              <small class="text-muted fst-italic">Email cannot be changed.</small>
            </div>
          </div>

          <div class="mt-4 text-end">
            <button type="submit" class="btn btn-success px-4 py-2 fw-bold" style="background-color: #008080; border:none;" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Saving...' : 'Update Profile' }}
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>