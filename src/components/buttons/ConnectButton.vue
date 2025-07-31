<script setup>
import { inject } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useCookies } from '@/utils/cookiesHandler'

const cookies = useCookies()
const Store = inject('GlobalStore')
const router = useRouter()

const token = cookies.get('userToken')
const name = cookies.get('userName')

const handleLogout = () => {
  cookies.remove('userToken')
  cookies.remove('userName')
  Store.userToken.value = ''
  Store.userName.value = ''
  router.push('/login') // ou '/' selon le comportement voulu
}
</script>

<template>
  <RouterLink to="/login" class="button-link" v-if="!token && !Store.userToken.value">
    <font-awesome-icon :icon="['fas', 'user']" />
    <p>Se connecter</p>
  </RouterLink>

  <div class="button-link" v-else @click="handleLogout">
    <h4>{{ name || Store.userName.value }}</h4>
    <p>Déconnexion</p>
  </div>
</template>

<style scoped>
.button-link {
  display: flex;
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: column;
  background-color: white;
  border: solid 1px #eadfdb;
  width: 80px;
  cursor: pointer;
}

.button-link p {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.button-link svg {
  font-size: 18px;
}

h4 {
  font-size: 14px;
  font-weight: bold;
}
</style>
