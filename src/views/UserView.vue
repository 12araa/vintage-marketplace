<script setup>
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/')
}

const isActive = (path) => route.path === path
</script>

<template>
  <div class="container py-5">
    <div class="row">
      
      <div class="col-lg-3 mb-4">
        <div class="list-group shadow-sm">
          <div class="list-group-item disabled fw-bold text-uppercase small bg-light">
            Settings
          </div>
          
          <router-link to="/user/profile" class="list-group-item list-group-item-action" :class="{ active: isActive('/user/profile') }">
            Profile Details
          </router-link>
          
          <router-link to="/user/change-password" class="list-group-item list-group-item-action">
            Change Password
          </router-link>
          
          <router-link to="/user/history" class="list-group-item list-group-item-action" :class="{ active: isActive('/user/history') }">
            Transaction History
          </router-link>
          
          <button @click="handleLogout" class="list-group-item list-group-item-action text-danger">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      <div class="col-lg-9">
        <router-view /> 
      </div>

    </div>
  </div>
</template>

<style scoped>
.list-group-item.active {
  background-color: #008080;
  border-color: #008080;
}
</style>