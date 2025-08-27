import { ref } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useCookies } from './cookiesHandler'
import { useRouter } from 'vue-router'

export function useUser(store) {
  const cookies = useCookies()
  const router = useRouter()

  const token = ref(cookies.get('userToken'))
  const userName = ref('')
  const userAvatar = ref('')
  const jwt = ref('')
  const userId = ref('')
  const userMail = ref('')
  const userLoaded = ref(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL

  const decodeToken = (rawToken) => {
    try {
      const payload = jwtDecode(rawToken)
      userId.value = payload.id
    } catch (error) {
      console.error('Échec du décodage du token :', error)
      userId.value = ''
    }
  }

  const getUser = async () => {
    const raw = token.value || store.userToken.value
    if (!raw) {
      console.error('Token manquant dans getUser()')
      userLoaded.value = true
      return
    }

    try {
      const response = await axios.get(`${baseUrl}/users/me?populate=*`, {
        headers: { Authorization: `Bearer ${raw}` },
      })
      jwt.value = raw

      userName.value = response.data.username
      userAvatar.value = response.data.avatar?.url || ''
      userId.value = response.data.id || ''
      userMail.value = response.data.email || ''
      store.userName.value = response.data.username
      store.userAvatar.value = response.data.avatar?.url || ''
    } catch (error) {
      console.error('Erreur lors de la récupération de l’utilisateur :', error)
    } finally {
      userLoaded.value = true
    }
  }

  const handleLogout = () => {
    cookies.remove('userToken')

    store.userToken.value = ''
    store.userName.value = ''
    store.userAvatar.value = ''
    userMail.value = ''
    userName.value = ''
    userAvatar.value = ''
    userId.value = ''
    token.value = null
    router.push('/login')
  }

  return {
    token,
    userName,
    userAvatar,
    jwt,
    userId,
    userLoaded,
    userMail,
    decodeToken,
    getUser,
    handleLogout,
  }
}
