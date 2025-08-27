<script setup>
import { ref, inject } from 'vue'
import axios from 'axios'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useCookies } from '@/utils/cookiesHandler'

import InscriptionButton from '@/components/buttons/InscriptionButton.vue'

const name = ref('')
const email = ref('')
const password = ref('')

const passwordVisible = ref(false)
const errorMessage = ref('')
const connecting = ref(false)

const router = useRouter()
const route = useRoute()
const cookies = useCookies()

const baseUrl = import.meta.env.VITE_BACKEND_URL

const Store = inject('GlobalStore')
if (!Store) {
  throw new Error('GlobalStore n’a pas été injecté correctement')
}

const handleSubmit = async () => {
  const body = {
    username: name.value,
    email: email.value,
    password: password.value,
  }

  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins six caractères'
    return
  }

  try {
    connecting.value = true
    const response = await axios.post(`${baseUrl}/auth/local/register`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    Store.userToken.value = response.data.jwt
    Store.userName.value = response.data.user.username
    cookies.set('userToken', response.data.jwt)
    cookies.set('userName', response.data.user.username)

    setTimeout(() => {
      const redirectTo = route.query.redirect || '/'
      router.push(redirectTo)
    }, 2000)
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error)
    errorMessage.value = 'Un problème est survenu, veuillez essayer à nouveau'
    connecting.value = false
  }
}

const handlePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const resetError = () => {
  errorMessage.value = ''
}
</script>

<template>
  <section>
    <div class="form-div">
      <h1>Bonjour !</h1>
      <p>Inscrivez-vous pour découvrir toutes nos fonctionnalités.</p>
      <form @submit.prevent="handleSubmit">
        <label for="name">Nom <span>*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Sophia"
          v-model="name"
          @input="resetError"
        />
        <label for="email">E-mail <span>*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="sophia@mail.com"
          v-model="email"
          @input="resetError"
        />
        <label for="password">Mot de passe <span>*</span></label>
        <div class="password">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            id="password"
            name="password"
            v-model="password"
            @input="resetError"
          />
          <button class="visibility" type="button" @click="handlePasswordVisibility">
            <font-awesome-icon :icon="passwordVisible ? ['fas', 'eye'] : ['fas', 'eye-slash']" />
          </button>
        </div>

        <InscriptionButton
          v-if="connecting"
          :disabled="true"
          text="Inscription en cours"
          icon="spinner"
        />
        <InscriptionButton v-else text="S'inscrire" icon="arrow-right" />

        <div class="errors">
          <p v-if="errorMessage !== ''">{{ errorMessage }}</p>
        </div>
        <div class="login-link">
          <p>Vous avez déjà un compte?</p>
          <RouterLink :to="{ path: '/login', query: { redirect: route.query.redirect } }"
            >Connectez-vous</RouterLink
          >
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
section {
  position: relative;
  min-height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/images/illustration.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  box-sizing: border-box;
}

.form-div {
  z-index: 1;
  background-color: white;
  max-width: 440px;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 28px;
  font-weight: bold;
  padding-bottom: 16px;
}

h1 + p {
  font-weight: 600;
  padding-bottom: 30px;
}

span {
  color: #b2b4b8;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
}

input {
  border: solid 1px #b2b4b8;
  padding: 12px;
  border-radius: 10px;
  box-sizing: border-box;
}

#email,
#name {
  margin-bottom: 20px;
}

input:focus {
  outline: none;
}

.password {
  display: flex;
  align-items: center;
  border: 1px solid #b2b4b8;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: white;
}

.password input {
  border: none;
  flex: 1;
  font-size: 14px;
  border-radius: 0;
  outline: none;
}

.visibility {
  background-color: transparent;
  border: none;
  border-left: 1px solid #b2b4b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 12px;
}

.visibility svg {
  color: #b2b4b8;
}

.errors {
  margin: 12px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: rgb(200, 46, 46);
}

.login-link {
  display: flex;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  margin-top: 20px;
}
.login-link a {
  font-weight: bold;
  text-decoration: underline;
}
</style>
