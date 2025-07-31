import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OfferView from '@/views/OfferView.vue'
import SignUpView from '@/views/SignUpView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: (route) => ({
        title: route.query.title || '',
        page: parseInt(route.query.page) || 1,
        pageSize: parseInt(route.query.pageSize) || 10,
      }),
    },
    { path: '/offer/:id', name: 'offer', component: OfferView, props: true },
    { path: '/signup', name: 'signup', component: SignUpView },
    { path: '/login', name: 'login', component: LoginView },
  ],
})

export default router
