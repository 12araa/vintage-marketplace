<script setup>
import Header from './components/header/Header.vue';
import Footer from './components/footer/Footer.vue';
import { useStore } from 'vuex';
const store = useStore()
store.dispatch('auth/fetchUser')
</script>

<template>
  <div id="app">
    <Header></Header>

    <router-view></router-view>

    <Footer></Footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>