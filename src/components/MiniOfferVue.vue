<script setup>
import placeholder from '@/assets/images/placeholder.jpg'
import axios from 'axios'

const props = defineProps({
  offer: {
    type: Object,
    required: true,
  },
  token: {
    type: [String, null],
    default: null,
  },
})

const emit = defineEmits(['offer-deleted'])

const offerId = props.offer.id
const title = props.offer.attributes.title
const price = props.offer.attributes.price
const picture = props.offer.attributes.pictures?.data?.[0]?.attributes?.url
const userToken = props.token

const deleteOffer = async (id) => {
  try {
    await axios.delete(`https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/offers/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    emit('offer-deleted', id)
  } catch (error) {
    console.error("Erreur lors de la suppression de l'offre:", error)
  }
}
</script>

<template>
  <div class="offer-wrapper">
    <div class="offer-infos">
      <div class="picture-section">
        <img :src="picture || placeholder" alt="image de l'annonce" />
      </div>
      <div class="offer-title">
        <h2>{{ title }}</h2>
      </div>
      <div class="offer-price">
        <p>{{ price }} €</p>
      </div>
    </div>
    <div class="delete-button" @click="deleteOffer(offerId)">
      <font-awesome-icon :icon="['fas', 'trash']" />
    </div>
  </div>
</template>
<style scoped>
.offer-wrapper {
  padding: 12px;
  margin: 20px 0;
  border: solid 1px #eadfdb;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.offer-infos {
  display: flex;
  align-items: center;
  gap: 14px;
}

.picture-section {
  height: 100px;
  width: 100px;
  border-radius: 5px;
}

.picture-section img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}

h2 {
  width: 200px;
  margin-left: 30px;
  padding-right: 10px;
  font-size: 18px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.offer-price {
  color: #893810;
  font-size: 18px;
  font-weight: bold;
}

.delete-button {
  color: #ec5a12;
  cursor: pointer;
}

@media (max-width: 600px) {
  h2 {
    margin-left: 10px;
    width: 160px;
    font-size: 16px;
    white-space: wrap;
    line-height: 24px;
  }

  .offer-price {
    font-size: 15px;
  }

  .picture-section {
    width: 80px;
    height: 80px;
  }

  .offer-infos {
    gap: 6px;
  }
}

@media (max-width: 440px) {
  h2 {
    width: 120px;
    font-size: 14px;
  }
  .offer-price {
    font-size: 13px;
  }
}
</style>
