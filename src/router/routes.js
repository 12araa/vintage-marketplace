import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductDetail from '@/components/detail/ProductDetail.vue'
import CartView from '../views/CartView.vue'
import OrderConfirmationView from '@/views/OrderConfirmationView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue')
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/order-confirmation',
    name: 'order-confirmation',
    component: OrderConfirmationView
  }

]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router