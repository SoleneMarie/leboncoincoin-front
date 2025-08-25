<script setup>
import placeholder from '@/assets/images/placeholder.jpg'

const props = defineProps({
  offer: {
    type: Object,
    required: true,
  },
})
console.log(
  props.offer.id,
  props.offer.attributes.title,
  props.offer.attributes.price,
  props.offer.attributes.pictures.data[0].attributes.url,
)

const title = props.offer.attributes.title
const price = props.offer.attributes.price
const picture = props.offer.attributes.pictures?.data?.[0]?.attributes?.url
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
    <div class="delete-button"><font-awesome-icon :icon="['fas', 'trash']" /></div>
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
  width: 100%;
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
}
</style>
