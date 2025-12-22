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
const imagePreview = ref(null)

const userData = reactive({
  fullname: '',
  email: '', 
  username: '',
  photoURL: ''
})

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 400; // Resize ke 400px
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.match('image.*')) {
    alert("Mohon upload file gambar.");
    return;
  }

  try {
    const compressedString = await compressImage(file);
    userData.photoURL = compressedString; 
    imagePreview.value = compressedString; 
  } catch (error) {
    console.error("Gagal memproses gambar:", error);
  }
};
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

      if (data.photoURL) {
        userData.photoURL = data.photoURL
        imagePreview.value = data.photoURL
      }
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
      photoURL: userData.photoURL,
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

          <div class="text-center mb-4">
            <div class="position-relative d-inline-block">
              <img 
                :src="imagePreview || 'https://ui-avatars.com/api/?name=' + (userData.fullname || 'User') + '&background=random'" 
                class="rounded-circle border border-2 border-white shadow-sm" 
                style="width: 120px; height: 120px; object-fit: cover;"
              >
              <label class="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm p-2" style="cursor: pointer; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-camera-fill text-primary" style="font-size: 1rem;"></i>
                <input type="file" @change="handleFileUpload" accept="image/*" hidden>
              </label>
            </div>
          </div>
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