<script setup>
import axios from 'axios'
import { inject, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useCookies } from '@/utils/cookiesHandler'
import { jwtDecode } from 'jwt-decode'

const cookies = useCookies()
const Store = inject('GlobalStore')
const router = useRouter()

const token = ref(cookies.get('userToken'))

const userName = ref('')
const userAvatar = ref('')
const avatar = ref(null)
const menuVisible = ref(false)
const userLoaded = ref(false)

const getUser = async () => {
  try {
    const response = await axios.get(
      'https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/users/me?populate=*',
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    )
    console.log('Utilisateur connecté :', response.data)
    userName.value = response.data.username
    console.log('avatar:', response.data.avatar.url)
    userAvatar.value = response.data.avatar.url
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

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}

const onAvatarChange = async (e) => {
  const file = e.target.files[0]
  if (!file) {
    return
  }
  avatar.value = file
  console.log('nouvel avatar :', file)
  const decoded = jwtDecode(token.value)
  const userId = decoded.id

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    await axios.put(
      `https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/users/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    console.log('Avatar mis à jour avec succès.')
    toggleMenu()
    await getUser()
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l’avatar :', err)
  }
}

const handleLogout = () => {
  cookies.remove('userToken')
  Store.userToken.value = ''
  Store.userName.value = ''
  Store.userAvatar.value = ''
  userName.value = ''
  userAvatar.value = ''
  token.value = null
  menuVisible.value = false
  router.push('/login') // ou '/' selon le comportement voulu
}
</script>

<template>
  <!-- S'il n'y a pas de token, on montre le lien de connexion -->
  <RouterLink to="/login" class="button-link" v-if="!token && !Store.userToken.value">
    <font-awesome-icon :icon="['fas', 'user']" />
    <p>Se connecter</p>
  </RouterLink>

  <!-- Sinon, une fois que l'utilisateur est chargé (même sans image), on affiche le menu -->
  <div class="dropdown-wrapper" v-else-if="userLoaded">
    <div class="button-link" @click="toggleMenu">
      <div class="avatar-container">
        <img
          :src="userAvatar || Store.userAvatar.value || '/src/assets/images/placeholder.jpg'"
          alt="avatar de l'utilisateur"
        />
      </div>
      <h4>{{ userName || Store.userName.value }}</h4>
    </div>

    <div class="dropdown-menu" v-if="menuVisible">
      <label class="avatar-upload">
        <p>Changer l’avatar</p>
        <input type="file" accept="image/*" @change="onAvatarChange" style="display: none" />
      </label>

      <button @click="handleLogout" class="logout-button">Se déconnecter</button>
    </div>
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
  background-color: white;
  border: solid 1px #eadfdb;
  width: 110px;
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

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e3e6e8;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 120px;
  font-size: 14px;
  font-weight: 600;
}

.avatar-upload {
  cursor: pointer;
  text-decoration: none;
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

.logout-button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 0;
}

.logout-button:hover {
  text-decoration: underline;
}
</style>
