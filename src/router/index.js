import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OfferView from '@/views/OfferView.vue'
import SignUpView from '@/views/SignUpView.vue'
import LoginView from '@/views/LoginView.vue'
import PublishView from '@/views/PublishView.vue'
import SuccessView from '@/views/SuccessView.vue'
import CancelView from '@/views/CancelView.vue'
import PaymentView from '@/views/PaymentView.vue'
import NotFound from '@/views/NotFound.vue'
import ProfileView from '@/views/ProfileView.vue'

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
    { path: '/publish', name: 'publish', component: PublishView, meta: { Authenticated: true } },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { Authenticated: true },
    },
    { path: '/success', name: 'success', component: SuccessView },
    { path: '/cancel', name: 'cancel', component: CancelView },
    {
      path: '/payment/:id',
      name: 'payment',
      component: PaymentView,
      props: true,
      meta: { Authenticated: true },
    },
    { path: '/:catchAll(.*)', name: 'notFound', component: NotFound },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
