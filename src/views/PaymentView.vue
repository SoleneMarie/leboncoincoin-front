<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { useCookies } from '@/utils/cookiesHandler'

const publicKey =
  'pk_test_51PuwocP7EWGvkP3C94fKlYJgPsKBh6deCHlhGWCpxNlYQQCBiye71vX1ocfBhHifKmoELR0kjHYLVgsdPN2pzCQv00QYzgpghj'
const stripePromise = loadStripe(publicKey)

const { id } = defineProps({
  id: String,
})

const deliveryCost = computed(() => {
  if (deliveryOption.value === 'colissimo') return 15.6
  return 0
})

const totalPrice = computed(() => {
  return offer.value ? offer.value.attributes.price + deliveryCost.value + 0.99 : 0
})

const route = useRoute()
const router = useRouter()
const cookies = useCookies()

const firstname = ref('')
const lastname = ref('')
const phone = ref('')
const error = ref('')
const offer = ref(null)
const deliveryOption = ref('hand')

const cardElement = ref(null)
const stripe = ref(null)
const elements = ref(null)

onMounted(async () => {
  const token = cookies.get('userToken')
  if (!token) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  const { data } = await axios.get(
    `https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/offers/${id}?populate=*`,
  )
  offer.value = data.data

  stripe.value = await stripePromise
  elements.value = stripe.value.elements()
  const card = elements.value.create('card')
  card.mount('#card-element')
  cardElement.value = card
})

const handlePayment = async () => {
  error.value = ''
  if (!firstname.value || !lastname.value || !phone.value) {
    error.value = 'Tous les champs sont obligatoires.'
    return
  }

  const { token, error: stripeError } = await stripe.value.createToken(cardElement.value)
  if (stripeError) {
    error.value = stripeError.message
    return
  }

  const deliveryFees = deliveryOption.value === 'colissimo' ? 15.6 : 0
  const protectionFees = 0.99
  const totalAmount = offer.value.attributes.price + deliveryFees + protectionFees

  try {
    const response = await axios.post(
      'https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/offers/buy',
      {
        title: offer.value.attributes.title,
        amount: totalAmount,
        token: token.id,
      },
    )

    if (response.data.status === 'succeeded') {
      alert(
        `Paiement validé pour l'achat du produit "${offer.value.attributes.title}" par ${firstname.value} ${lastname.value}`,
      )
      router.push('/success')
    } else {
      error.value = "Le paiement n'a pas pu être validé."
    }
  } catch (error) {
    error.value = 'Erreur lors du paiement.'
  }
}
</script>

<template>
  <section v-if="offer" class="payment-wrapper">
    <div class="form-part">
      <h2>Finalisez votre paiement</h2>

      <div class="personal-info">
        <h3>Informations personnelles</h3>
        <input v-model="firstname" placeholder="Prénom" />
        <input v-model="lastname" placeholder="Nom" />
        <input v-model="phone" placeholder="Téléphone" />
        <p class="info">Recevoir un SMS pour l’arrivée de votre colis</p>
      </div>

      <div class="card-info">
        <h3>Coordonnées bancaires</h3>
        <div id="card-element" class="stripe-card"></div>
      </div>

      <button @click="handlePayment">Payer</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div class="recap-part">
      <div class="product">
        <img
          :src="
            offer.attributes.pictures?.data?.[0]?.attributes?.url ||
            '/src/assets/images/placeholder.jpg'
          "
          alt=""
        />
        <div>
          <h4>{{ offer.attributes.title }}</h4>
          <p>{{ offer.attributes.price.toFixed(2) }} €</p>
        </div>
      </div>

      <div class="line">
        <label>
          <input type="radio" name="delivery" value="hand" v-model="deliveryOption" />
          Remise en main propre
        </label>
        <p>0,00 €</p>
      </div>

      <div class="line">
        <label>
          <input type="radio" name="delivery" value="colissimo" v-model="deliveryOption" />
          Colissimo
        </label>
        <p>15,60 €</p>
      </div>

      <div class="line">
        <p>Protection Leboncoin</p>
        <p>0,99 €</p>
      </div>

      <div class="total">
        <p>Total</p>
        <p>{{ totalPrice.toFixed(2) }} €</p>
      </div>
    </div>
  </section>

  <p v-else>Chargement...</p>
</template>

<style scoped>
.payment-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 20px;
}

.form-part,
.recap-part {
  width: 48%;
}

input {
  display: block;
  width: 100%;
  padding: 8px;
  margin: 6px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 20px;
  background-color: #ec5a12;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.stripe-card {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.product {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.product img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.line,
.total {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}

.total {
  font-weight: bold;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
