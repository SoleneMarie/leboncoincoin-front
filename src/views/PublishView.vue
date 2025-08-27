<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useCookies } from '@/utils/cookiesHandler'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'vue-router'

const cookies = useCookies()
const router = useRouter()

const pictures = ref([])
const title = ref('')
const description = ref('')
const price = ref(0)
const isPublishing = ref(false)
const postError = ref('')
const userLoaded = ref(false)

const resetError = () => {
  postError.value = ''
}

const handleSubmit = async () => {
  isPublishing.value = true

  if (!title.value || !description.value || !price.value) {
    postError.value = 'Veuillez compléter tous les champs'
    isPublishing.value = false
    return
  }

  const token = cookies.get('userToken')
  if (!token) {
    postError.value = 'Aucun utilisateur connecté trouvé'
    isPublishing.value = false
    return
  }

  const decoded = jwtDecode(token)
  if (!decoded) {
    postError.value = 'Aucun utilisateur connecté trouvé'
    isPublishing.value = false
    return
  }

  const formData = new FormData()
  const stringifiedInfos = JSON.stringify({
    title: title.value,
    description: description.value,
    price: price.value,
    owner: decoded.id,
  })

  const picturesCopy = [...pictures.value]
  picturesCopy.reverse().forEach((file) => {
    formData.append('files.pictures', file)
  })
  formData.append('data', stringifiedInfos)

  try {
    const response = await axios.post(
      'https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/offers?populate=*',
      formData,
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    const offerId = response.data.data.id
    isPublishing.value = false
    router.push({ name: 'offer', params: { id: offerId } })
  } catch (error) {
    console.error("Erreur de publication de l'annonce :", error)
    postError.value = 'Une erreur est survenue, veuillez réessayer'
    isPublishing.value = false
  }
}

function handleChange(e) {
  const picked = Array.from(e.target.files || [])
  const remaining = Math.max(0, 10 - pictures.value.length)
  if (remaining === 0) {
    postError.value = "Vous ne pouvez plus ajouter d'images."
    return
  }
  if (picked.length > remaining) {
    postError.value = `Vous pouvez encore ajouter ${remaining} image(s) maximum.`
    return
  }
  pictures.value.push(...picked.slice(0, remaining))
  e.target.value = ''
}

const urlListPreview = computed(() => {
  const tab = []
  for (const key in pictures.value) {
    if (Object.hasOwnProperty.call(pictures.value, key)) {
      tab.push(URL.createObjectURL(pictures.value[key]))
    }
  }
  return tab
})

function removeImage(index) {
  pictures.value.splice(index, 1)
  resetError()
}

onMounted(async () => {
  const token = cookies.get('userToken')

  if (!token) {
    router.push('/login')
    return
  }

  try {
    await axios.get('https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/users/me', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    userLoaded.value = true
  } catch (e) {
    console.error('Utilisateur non trouvé', e)
    router.push('/login')
  }
})
</script>

<template>
  <section v-if="userLoaded">
    <form @submit.prevent="handleSubmit">
      <h2>Déposer une annonce</h2>
      <div class="form-part">
        <label for="title">Titre de l'annonce</label>
        <input
          type="text"
          id="title"
          name="title"
          maxlength="50"
          v-model="title"
          @input="resetError"
        />
        <p class="description">Vous n'avez pas besoin de mentionner "Achat" ou "Vente" ici.</p>
      </div>

      <div class="form-part">
        <label for="description">Description de l'annonce</label>
        <textarea
          name="description"
          id="description"
          rows="6"
          v-model="description"
          @input="resetError"
        ></textarea>
        <p class="description">
          Nous vous rappelons que la vente de contrefaçon est interdite. Nous vous invitons à
          ajouter tout élément permettant de prouver l'authenticité de votre article : numéro de
          série, facture, certificat, inscription de la marque sur l'article, emballage etc.
          Indiquez dans le texte de l'annonce si vous proposez un droit de rétractation à
          l'acheteur. En l'absence de toute mention, l'acheteur n'en bénéficiera pas et ne pourra
          pas demander le remboursement ou l'échange du bien ou service proposé.
        </p>
      </div>

      <div class="form-part">
        <label for="price">Votre prix de vente</label>
        <div class="input">
          <input type="number" id="price" name="price" v-model="price" @input="resetError" />
          <p>€</p>
        </div>
      </div>

      <div class="form-part">
        <p class="photo-p">Ajoutez des photos</p>
        <input
          id="photos"
          type="file"
          class="visually-hidden"
          multiple
          accept="image/*"
          @change="handleChange"
        />
        <label for="photos" class="upload-card" @dragover.prevent @dragenter.prevent tabindex="0">
          <font-awesome-icon :icon="['fas', 'camera']" class="camera-icon" />
          <div class="upload-text">
            <p>Sélectionnez jusqu'à 10 photos</p>
          </div>
        </label>

        <ul class="thumbs" v-if="urlListPreview.length">
          <li v-for="(url, i) in urlListPreview" :key="i" class="thumb-item">
            <img :src="url" alt="" />
            <button type="button" class="remove-button" @click="removeImage(i)">&times;</button>
          </li>
        </ul>
      </div>

      <div class="button-div">
        <button :disabled="isPublishing">
          {{ isPublishing ? 'Envoi en cours…' : 'Déposer mon annonce' }}
        </button>
      </div>

      <div class="errorMessages">
        <p v-if="postError !== ''">{{ postError }}</p>
      </div>
    </form>
  </section>

  <section v-else>
    <p>Chargement...</p>
  </section>
</template>

<style scoped>
section {
  display: flex;
  align-items: flex-start; /* en haut verticalement */
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

form {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 34px;
}

.form-part {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  max-width: 700px;
}

label,
.photo-p {
  margin-bottom: 8px;
  font-size: 14px;
}

input,
textarea {
  border: solid 1px #b2b4b8;
  padding: 12px;
  border-radius: 10px;
  box-sizing: border-box;
}

input:focus,
textarea:focus {
  outline: none;
}

/* Inputs spécifiques */
.input {
  border: solid 1px #eadfdb;
  border-radius: 20px;
  box-sizing: border-box;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  width: 180px;
}

.input input {
  border: none;
  padding: 0 10px;
  width: 130px;
}

.input p {
  border-left: solid 1px #eadfdb;
  height: 40px;
  padding: 0 10px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 600;
}

/* --------------------------------------------------------- */
.description {
  color: rgb(112, 106, 125);
  font-size: 12px;
  margin-top: 6px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.upload-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 220px;
  height: 140px;
  border: 2px solid #c9d3df;
  border-radius: 12px;
  background: #f8fbff;
  cursor: pointer;
  user-select: none;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.upload-card:hover,
.upload-card:focus {
  outline: none;
  border-color: #0d3b66;
  box-shadow: 0 0 0 3px rgba(13, 59, 102, 0.15);
  background: #f2f7ff;
}

svg {
  font-size: 28px;
  color: #0d3b66;
}

.upload-text {
  text-align: center;
  color: #17324d;
  font-size: 13px;
  font-weight: 600;
}

.thumbs {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  max-width: 600px;
  padding: 0;
  list-style: none;
}
.thumbs img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e3e8ef;
}

.button-div {
  display: flex;
  justify-content: end;
}

button {
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  gap: 4px;
  color: #f9eeea;
  font-weight: bold;
  border: none;
  background-color: #ec5a12;
}

.thumb-item {
  position: relative;
}

.remove-button {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #ec5a12;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-button:hover {
  background-color: #c94a0f;
}
</style>
