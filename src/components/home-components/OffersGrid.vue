<script setup>
import { RouterLink } from 'vue-router'
import { formatPrice } from '@/utils/formatPrice'

defineProps({
  offers: { type: Array, required: true, default: () => [] },
})
</script>
<template>
  <section class="offers-wrapper">
    <div v-if="offers.length === 0" class="empty"><p>Aucun offre disponible</p></div>
    <section v-else class="grid">
      <div v-for="offer in offers" :key="offer.id" class="offer">
        <div class="owner">
          <div class="image-container">
            <img
              :src="
                offer.attributes.owner?.data?.attributes?.avatar?.data
                  ? offer.attributes.owner.data.attributes.avatar.data.attributes.url
                  : '/src/assets/images/default-profile.jpeg'
              "
              alt="avatar"
              class="avatar"
            />
          </div>
          <p>{{ offer.attributes.owner.data.attributes.username }}</p>
        </div>
        <RouterLink :to="{ name: 'offer', params: { id: offer.id } }">
          <div class="main-image">
            <img
              :src="
                offer.attributes.pictures?.data?.[0]
                  ? offer.attributes.pictures.data[0].attributes.url
                  : '/src/assets/images/placeholder.jpg'
              "
              alt="offer image"
            />
          </div>
          <div class="infos">
            <p>{{ offer.attributes.title }}</p>
            <p>{{ formatPrice(offer.attributes.price) }} €</p>
          </div></RouterLink
        >
        <div class="date-and-like">
          <p>{{ new Date(offer.attributes.publishedAt).toLocaleDateString('fr-FR') }}</p>
          <font-awesome-icon icon="fa-regular fa-heart" />
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.empty {
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.offer {
  width: 100%;
  height: 380px;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  background-color: rgb(246, 247, 249);
  padding: 6px;
  border-radius: 10px;
}

.owner {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px;
}

.image-container {
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.owner > p {
  font-weight: bold;
  font-size: 14px;
  padding-top: 10px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.main-image {
  height: 220px;
  border-radius: 20px;
  width: full;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.infos {
  margin: 10px 0;
  padding: 0 6px;
  line-height: 24px;
  font-weight: bold;
}

.date-and-like {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  color: rgb(112, 106, 125);
}

.date-and-like p {
  font-size: 13px;
}

.date-and-like svg {
  font-size: 20px;
}
</style>
