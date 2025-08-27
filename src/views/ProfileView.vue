<script setup>
import { inject, onMounted, ref } from 'vue'
import { useUser } from '@/utils/userHandler'
import axios from 'axios'
import MiniOfferVue from '@/components/MiniOfferVue.vue'

const Store = inject('GlobalStore')

const { token, userName, userAvatar, jwt, userId, userLoaded, userMail, getUser, handleLogout } =
  useUser(Store)

const baseUrl = import.meta.env.VITE_BACKEND_URL

const avatar = ref(null)
const loading = ref(false)
const error = ref(null)
const offers = ref([])
const length = ref(0)

const removeOffer = (id) => {
  offers.value = offers.value.filter((offer) => offer.id !== id)
}

const getUserOffers = async () => {
  if (!userId.value) return
  try {
    const response = await axios.get(
      `${baseUrl}/offers?filters[owner][id][$eq]=${userId.value}&populate=owner&populate=pictures`,
      {
        headers: {
          Authorization: `Bearer ${jwt.value}`,
        },
      },
    )
    offers.value = response.data.data
    if (offers.value.length !== 0) {
      length.value = offers.value.length
    } else {
      length.value = 0
    }
  } catch (error) {
    console.error('Erreur lors du chargement des offres :', error)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    if (token.value && !userLoaded.value) {
      await getUser()
      await getUserOffers()
    }
  } catch (error) {
    error.value = 'Impossible de charger le profil.'
  } finally {
    loading.value = false
  }
})

const onAvatarChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  avatar.value = file

  const formData = new FormData()
  formData.append('avatar', file)

  loading.value = true
  try {
    await axios.put(`${baseUrl}/users/${userId.value}`, formData, {
      headers: {
        Authorization: `Bearer ${jwt.value}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    await getUser()
  } catch (error) {
    error.value = "Erreur lors de la mise à jour de l'avatar"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="profile-page">
    <div v-if="loading" class="profile-skeleton">
      <div class="avatar-skeleton"></div>
      <div class="infos-skeleton">
        <div class="line-skeleton short"></div>
        <div class="line-skeleton long"></div>
      </div>
    </div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else-if="userLoaded" class="profile-info">
      <div class="avatar">
        <label class="avatar-upload">
          <img v-if="userAvatar" :src="userAvatar" alt="avatar" />
          <p v-else class="letter-avatar">{{ (userName || '').charAt(0).toUpperCase() }}</p>
          <input type="file" accept="image/*" @change="onAvatarChange" style="display: none" />
        </label>
      </div>

      <div class="user-infos">
        <h2>{{ userName }}</h2>
        <p>{{ userMail }}</p>
      </div>
    </div>

    <div class="profile-offers">
      <div v-if="offers.length !== 0">
        <h3>{{ length }} annonces</h3>
        <div v-for="offer in offers" :key="offer.id">
          <MiniOfferVue :offer="offer" :token="token" @offer-deleted="removeOffer" />
        </div>
      </div>
      <div v-else>
        <h3>Aucune annonce</h3>
      </div>
    </div>

    <button @click="handleLogout()" class="logout-button">
      Se déconnecter <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
    </button>
  </section>
</template>

<style scoped>
.profile-skeleton {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px;
  border: solid 1px #e3e6e8;
  border-radius: 10px;
  width: 100%;
}

.avatar-skeleton {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.infos-skeleton {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.line-skeleton {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.line-skeleton.short {
  width: 100px;
}

.line-skeleton.long {
  width: 200px;
}

.profile-page {
  width: 100%;
  margin-bottom: auto;
  padding-top: 20px;
  box-sizing: border-box;
}

.profile-info {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 30px;
  border: solid 1px #e3e6e8;
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 8px;
}

.avatar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.avatar-upload {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #566e82;
  font-size: 28px;
  cursor: pointer;
  margin: 10px 0;
  display: inline-block;
}

.avatar-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.letter-avatar {
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
}

.profile-offers {
  padding: 30px 0;
}

h3 {
  font-size: 16px;
  font-weight: bold;
  padding: 12px 0;
}

.logout-button {
  font-size: 14px;
  display: flex;
  padding: 10px 8px;
  margin-bottom: 20px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: white;
  border: solid 1px #eadfdb;
  cursor: pointer;
}

.logout-button svg {
  margin-left: 8px;
}
</style>
