<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { formatPrice } from '@/utils/formatPrice'
import { useCycleList } from '@vueuse/core'
import { useRouter } from 'vue-router'
const router = useRouter()

const { id } = defineProps({
  id: String,
})

const postData = ref([])
const pictures = ref([])
const isLoading = ref(true)

const currentPicture = ref(null)
let cycle = null

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/offers/${id}?populate[pictures]=*&populate[owner][populate]=avatar`,
    )
    postData.value = data.data
    pictures.value = data.data.attributes?.pictures?.data || []
  } catch (error) {
    console.error("Erreur dans la récupération des donnée de l'article : ", error)
  } finally {
    isLoading.value = false
  }
})

watch(pictures, (newPictures) => {
  if (Array.isArray(newPictures) && newPictures.length > 0) {
    cycle = useCycleList(newPictures)
    currentPicture.value = cycle.state
  }
})

const next = () => cycle?.next()
const prev = () => cycle?.prev()

const goToPayment = () => {
  router.push({ name: 'payment', params: { id } })
}
</script>

<template>
  <section v-if="!isLoading && postData.attributes">
    <div class="main-body">
      <div class="img-nav">
        <font-awesome-icon
          v-if="pictures.length > 1"
          class="arrow"
          :icon="['fas', 'angle-left']"
          @click="prev()"
        />
        <div class="image-container">
          <img
            :src="currentPicture?.value?.attributes?.url || '/src/assets/images/placeholder.jpg'"
            alt="image de l'annonce"
          />
        </div>
        <font-awesome-icon
          v-if="pictures.length > 1"
          class="arrow"
          :icon="['fas', 'angle-right']"
          @click="next()"
        />
      </div>

      <div class="right-col">
        <div>
          <div class="identity">
            <div class="avatar-container">
              <img
                :src="
                  postData.attributes?.owner?.data?.attributes?.avatar?.data?.attributes?.url
                    ? postData.attributes.owner.data.attributes.avatar.data.attributes.url
                    : '/src/assets/images/default-profile.jpeg'
                "
                alt="avatar"
              />
            </div>
            <p>{{ postData.attributes.owner.data.attributes.username.toUpperCase() }}</p>
          </div>
          <div class="id-card">
            <font-awesome-icon :icon="['fas', 'check-double']" />
            <p>Pièce d'identité vérifiée</p>
          </div>
          <div class="answer">
            <font-awesome-icon :icon="['far', 'clock']" />
            <p>Répond généralement en 1 heure</p>
          </div>
        </div>
        <div class="buttons">
          <button class="buy" @click="goToPayment">Acheter</button>
          <button class="message">Message</button>
        </div>
      </div>
    </div>
    <div class="offer-infos">
      <div>
        <h2>{{ postData.attributes.title }}</h2>
        <h3>{{ formatPrice(postData.attributes.price) }} €</h3>
        <h4>{{ new Date(postData.attributes.publishedAt).toLocaleDateString('fr-FR') }}</h4>
      </div>
    </div>
    <div class="description">
      <h3>Description</h3>
      <p>{{ postData.attributes.description ? postData.attributes.description : '' }}</p>
    </div>
    <div class="localisation">
      <font-awesome-icon :icon="['fas', 'location-dot']" />
      <p>La Valette-du-Var (83160)</p>
    </div>
  </section>
  <section v-else class="skeleton">
    <div class="skeleton-main-body">
      <div class="skeleton-img"></div>
      <div class="skeleton-right">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>
    <div class="skeleton-offer">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
    <div class="skeleton-desc">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 100%;
}

.main-body {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 12px;
}

.img-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.img-nav svg {
  font-size: 22px;
  cursor: pointer;
}

.image-container {
  width: 450px;
  aspect-ratio: 5 / 4;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.avatar-container {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

.avatar-container img {
  object-fit: cover;
  border-radius: 50%;
}

.identity {
  display: flex;
  gap: 14px;
  padding-bottom: 20px;
}

.identity p {
  margin-top: 8px;
  font-size: 18px;
  font-weight: bold;
}

.id-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fee9dd;
  color: #893810;
  width: 170px;
  text-align: center;
  padding: 5px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 16px;
}

.id-card svg {
  font-size: 14px;
}

.answer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
}

.buttons {
  display: flex;
  border-top: solid 1px #e3e6e8;
  padding: 14px 0;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

button {
  display: flex;
  padding: 12px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #f9eeea;
  font-weight: bold;
  border: none;
}

.buy {
  background-color: #ec5a12;
}

.message {
  background-color: #094171;
}

.offer-infos {
  padding: 20px 0;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

h3 {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 13px;
}

h4 {
  font-size: 12px;
  color: rgb(112, 106, 125);
}

.description {
  padding: 20px 0;
  border-top: solid 1px #e3e6e8;
}

.description p {
  margin-top: 18px;
  font-size: 15px;
}

.localisation {
  padding: 20px 0;
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 14px;
}

.skeleton {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
}

.skeleton-main-body {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
}

.skeleton-img {
  width: 450px;
  aspect-ratio: 5 / 4;
  background: #e3e6e8;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}

.skeleton-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 200px;
}

.skeleton-avatar {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background: #e3e6e8;
  animation: pulse 1.5s infinite;
}

.skeleton-line {
  height: 16px;
  background: #e3e6e8;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-line.short {
  width: 120px;
}

.skeleton-offer,
.skeleton-desc {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
