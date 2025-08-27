<script setup>
import axios from 'axios'
import { inject, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCookies } from '@/utils/cookiesHandler'

const baseUrl = import.meta.env.VITE_BACKEND_URL

const cookies = useCookies()
const Store = inject('GlobalStore')

const token = ref(cookies.get('userToken'))
const userName = ref('')
const userAvatar = ref('')
const userLoaded = ref(false)

const getUser = async () => {
  const jwt = token.value || Store.userToken.value || cookies.get('userToken')

  if (!jwt) {
    console.error('Token manquant dans getUser()')
    return
  }
  try {
    const response = await axios.get(`${baseUrl}/users/me?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    userName.value = response.data.username
    userAvatar.value = response.data.avatar?.url
    Store.userName.value = response.data.username
    Store.userAvatar.value = response.data.avatar?.url || ''
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur :', error)
  } finally {
    userLoaded.value = true
  }
}

watch(
  () => cookies.get('userToken'),
  async (newToken) => {
    token.value = newToken
    if (newToken) {
      await getUser()
    } else {
      userLoaded.value = false
    }
  },
  { immediate: true }, // Lance immédiatement au premier rendu
)
</script>

<template>
  <RouterLink to="/login" class="button-link" v-if="!token && !Store.userToken.value">
    <font-awesome-icon :icon="['fas', 'user']" />
    <p>Se connecter</p>
  </RouterLink>

  <div class="wrapper" v-else>
    <RouterLink to="/profile" class="button-link">
      <div class="avatar-container">
        <img
          :src="userAvatar || Store.userAvatar.value || '/src//default-profile.jpeg'"
          alt="avatar de l'utilisateur"
        />
      </div>
      <h4>{{ userName || Store.userName.value }}</h4>
    </RouterLink>
  </div>
</template>

<style scoped>
@media (max-width: 860px) {
  p,
  h4 {
    display: none;
  }

  .button-link {
    width: 50px;
  }
}

@media (min-width: 861px) {
  .button-link {
    width: 110px;
  }
}

.button-link {
  display: flex;
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: white;
  border: solid 1px #eadfdb;
  cursor: pointer;
}

.button-link p {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
  cursor: pointer;
}

.button-link svg {
  font-size: 18px;
}

h4 {
  font-size: 14px;
  font-weight: bold;
}

.avatar-container {
  height: 34px;
  width: 34px;
  border-radius: 50%;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
