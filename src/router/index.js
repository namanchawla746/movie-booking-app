import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { authStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: () => import('../views/MovieDetail.vue')
    },
    /* 🎬 Theatre & Showtimes Selection Route */
    {
      path: '/select-theatre/:id',
      name: 'select-theatre',
      component: () => import('../views/SelectTheatreView.vue')
    },
    {
      path: '/book/:id/:date/:showtime',
      name: 'seat-selection',
      component: () => import('../views/SeatSelection.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/food',
      name: 'food-beverages',
      component: () => import('../views/FoodBeveragesView.vue')
    },
    /* ❤️ Wishlist Route */
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/WishlistView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Route Protection Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isLoggedIn()) {
    alert('Please login to access this page!');
    next('/login');
  } else {
    next();
  }
})

export default router