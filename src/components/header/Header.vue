<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isLoggedIn = computed(() => store.state.user !== null)

const user = computed(() => store.state.user)

const handleLogout = async () => {
  await store.dispatch('logout')
  router.push('/login')
}

const cartCount = 1
const wishlistCount = 3
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center gap-2" :to="{ name: 'home' }">
        <img src="@/assets/images/Logo.png" alt="Logo" class="d-inline-block align-text-top">
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <form class="d-flex mx-auto my-2 my-lg-0 w-50" role="search">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input class="form-control border-start-0 bg-light" type="search" placeholder="Search for items..." aria-label="Search">
          </div>
        </form>

        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
          
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link to="/login" class="btn btn-outline-success px-4">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="btn btn-success px-4 text-white">Sign up</router-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item position-relative">
              <router-link to="/cart" class="nav-link text-dark fs-5">
                <i class="bi bi-cart"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">
                  {{ cartCount }}
                </span>
              </router-link>
            </li>
            
            <li class="nav-item position-relative">
              <a href="#" class="nav-link text-dark fs-5">
                <i class="bi bi-heart"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">
                  {{ wishlistCount }}
                </span>
              </a>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
                <img src="https://ui-avatars.com/api/?name=User+Name&background=random" class="rounded-circle" width="32" height="32" alt="User">
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                <li><router-link to="/profile" class="dropdown-item">Profile</router-link></li>
                <li><a class="dropdown-item" href="#">Orders</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" @click="handleLogout">Logout</button></li>
              </ul>
            </li>
          </template>

        </ul>
      </div>
    </div>
  </nav>
  
  <div style="height: 80px;"></div>
</template>

<style scoped>
/* Styling khusus search bar agar mirip desain */
.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}
.input-group-text {
  background-color: #f8f9fa;
}
</style>