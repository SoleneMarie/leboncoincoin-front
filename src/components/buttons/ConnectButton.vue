<script setup>
import { inject, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCookies } from '@/utils/cookiesHandler'
import { useUser } from '@/utils/userHandler'

const cookies = useCookies()
const Store = inject('GlobalStore')

const { token, userName, userAvatar, jwt, userId, userLoaded, decodeToken, getUser } =
  useUser(Store)

onMounted(async () => {
  if (token.value) {
    console.log('token : ', token.value)
    decodeToken(token.value)
    await getUser()
  }
})

watch(
  () => cookies.get('userToken'),
  async (newToken) => {
    token.value = newToken
    if (newToken) {
      userLoaded.value = false
      decodeToken(newToken)
      await getUser()
    } else {
      userId.value = ''
      jwt.value = ''
      userLoaded.value = false
      userName.value = ''
      userAvatar.value = ''
      Store.userName.value = ''
      Store.userAvatar.value = ''
    }
  },
  { immediate: true }, // Lance immédiatement au premier rendu
)
</script>

<template>
  <RouterLink to="/login" class="button-link" v-if="!token.value && !Store.userToken.value">
    <font-awesome-icon :icon="['fas', 'user']" />
    <p class="connect">Se connecter</p>
  </RouterLink>

  <div v-else-if="userLoaded">
    <RouterLink :to="{ name: 'profile', params: { id: userId } }" class="button-link">
      <div class="profile">
        <div class="avatar-container">
          <img
            v-if="userAvatar || Store.userAvatar.value"
            :src="userAvatar || Store.userAvatar.value"
            alt="avatar de l'utilisateur"
          />
          <p v-else class="letter-avatar">{{ (userName || '').charAt(0).toUpperCase() }}</p>
        </div>
        <h4>{{ userName || Store.userName.value }}</h4>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.button-link {
  display: flex;
  padding: 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: white;
  border: solid 1px #eadfdb;
  width: 100px;
  cursor: pointer;
}

.button-link p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
  cursor: pointer;
}

.button-link svg {
  font-size: 16px;
}

h4 {
  font-size: 13px;
}

.connect {
  font-size: 12px;
}

.profile {
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.avatar-container {
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background-color: #566e82;
}

.letter-avatar {
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
