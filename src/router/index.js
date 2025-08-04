import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OfferView from '@/views/OfferView.vue'
import SignUpView from '@/views/SignUpView.vue'
import LoginView from '@/views/LoginView.vue'
import PublishView from '@/views/PublishView.vue'
import VueCookies from 'vue-cookies'
import SuccessView from '@/views/SuccessView.vue'
import CancelView from '@/views/CancelView.vue'

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
    { path: '/success', name: 'success', component: SuccessView },
    { path: '/cancel', name: 'cancel', component: CancelView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const userToken = VueCookies.get('userToken')
  if (to.meta.Authenticated && !userToken) {
    return { name: 'login', query: { redirect: to.name } }
  }
})

export default router
