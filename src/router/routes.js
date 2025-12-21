import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductDetail from '@/components/detail/ProductDetail.vue'
import CartView from '../views/CartView.vue'
import OrderConfirmationView from '@/views/OrderConfirmationView.vue'
import UserView from '@/views/UserView.vue'
import TransactionHistory from '@/components/user/TransactionHistory.vue'
import UserProfile from '@/components/user/UserProfile.vue'
import ChangePassword from '@/components/user/ChangePassword.vue'
import AllProducts from '@/components/product/AllProducts.vue'

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
  },
  {
    path: '/products',
    name: 'products',
    component: AllProducts
  },
  {
    path: '/user',
    component: UserView,
    children: [
        {
            path: 'history', 
            name: 'transaction-history',
            component: TransactionHistory
        },
        {
            path: 'profile',
            name: 'user-profile',
            component: UserProfile
        },
        {
            path: 'change-password',
            name: 'change-password',
            component: ChangePassword
        }
    ]
  }

]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router