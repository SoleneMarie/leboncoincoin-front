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
  <section v-if="offer">
    <h2>Finalisez votre paiement</h2>
    <div class="payment-wrapper">
      <div class="form-part">
        <div class="personal-info">
          <h3>Informations personnelles</h3>
          <p class="description">
            Une pièce d'identité vous sera demandée pour récupérer votre colis.
          </p>
          <label for="firstname">Prénom</label>
          <input
            type="text"
            v-model="firstname"
            placeholder="Prénom"
            name="firstname"
            id="firstname"
            autocomplete="given-name"
          />
          <label for="lastname">Nom</label>
          <input
            type="text"
            v-model="lastname"
            placeholder="Nom"
            name="lastname"
            id="lastname"
            autocomplete="family-name"
          />
          <label for="phone">Téléphone</label>
          <input
            type="tel"
            v-model="phone"
            placeholder="Téléphone"
            name="phone"
            id="phone"
            autocomplete="tel"
          />
          <p class="description">
            Recevoir un SMS pour l’arrivée de votre colis ou votre code de locker
          </p>
        </div>
        <p class="description">
          Vous ne serez débité que lorsque le vendeur aura confirmé la disponibilité de la commande
        </p>
        <div class="card-info">
          <h3>Coordonnées bancaires</h3>
          <div id="card-element" class="stripe-card"></div>
          <button @click="handlePayment">Payer</button>
          <p class="description">
            Paiment sécurisé. Votre banque peut vous demander d'autoriser le paiement pour compléter
            votre achat. Vous êtes sur un serveur de paiement sécurisé par les normes ssl (https) et
            pcidss de nos partenaires bancaires. Vos données sont encryptées pour plus de sécurité.
          </p>
        </div>

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
          <div class="product-attributes">
            <h4>{{ offer.attributes.title }}</h4>
            <p class="price">{{ offer.attributes.price.toFixed(2) }} €</p>
          </div>
        </div>
        <div class="h4-div"><h4>Mode de remise</h4></div>

        <div class="line">
          <input type="radio" name="delivery" value="hand" v-model="deliveryOption" />
          <div class="input-infos">
            <label for="delivery"> Remise en main propre </label>
            <div class="infos-p">
              <p class="light-description">
                Payez en ligne et récupérez votre achat en main propre lors de votre rendez-vous
                avec le vendeur
              </p>
              <p class="price">0,00 €</p>
            </div>
          </div>
        </div>

        <div class="line">
          <input type="radio" name="delivery" value="colissimo" v-model="deliveryOption" />
          <div class="input-infos">
            <label for="delivery"> Colissimo </label>
            <div class="infos-p">
              <p class="light-description">A votre domicile sous 2-3 jours</p>
              <p class="price">15,60 €</p>
            </div>
          </div>
        </div>

        <div class="protect-line">
          <h4>Protection Leboncoin</h4>
          <p class="price">0,99 €</p>
        </div>
        <div class="protection">
          <p>
            <font-awesome-icon :icon="['fas', 'check']" class="check-icon" /> Votre argent est
            sécurisé et versé au bon moment
          </p>
          <p>
            <font-awesome-icon :icon="['fas', 'check']" class="check-icon" /> Notre service client
            dédié vous accompagne
          </p>
        </div>

        <div class="total">
          <h4>Total</h4>
          <p class="price">{{ totalPrice.toFixed(2) }} €</p>
        </div>
      </div>
    </div>
  </section>

  <p v-else>Chargement...</p>
</template>

<style scoped>
section {
  width: 100%;
  box-sizing: border-box;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
}

h4 {
  margin: 0 20px;
  font-weight: 700;
  font-size: 15px;
}

.h4-div {
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  margin-top: 20px;
  padding-top: 20px;
  margin-bottom: 10px;
}

.description,
.light-description {
  font-size: 12px;
}

.light-description {
  color: rgb(112, 106, 125);
  line-height: 22px;
  margin-top: 4px;
}

.payment-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-part {
  width: 60%;
}

.recap-part {
  width: 38%;
}

.form-part,
.recap-part {
  box-sizing: border-box;
}

.personal-info {
  margin-bottom: 20px;
}

.personal-info label {
  display: block;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
}

.card-info {
  margin-top: 20px;
}

.form-part input {
  display: block;
  width: 100%;
  padding: 12px;
  margin: 6px 0;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  box-sizing: border-box;
}

button {
  margin-top: 20px;
  margin-bottom: 12px;
  display: flex;
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #f9eeea;
  font-weight: bold;
  border: none;
  width: 70px;
  background-color: #ec5a12;
}

.stripe-card {
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

.product {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.product img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-attributes {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #924823;
  font-weight: bold;
  white-space: nowrap;
}

.total,
.line,
.protect-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  margin: 8px 0;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
}

.protect-line {
  margin: 20px 30px 20px 0;
}

.protection {
  font-size: 14px;
  line-height: 24px;
  margin: -14px 20px 0 20px;
}

.line h4 {
  margin: 30px 0 10px 0;
  display: block;
}

.error {
  color: red;
  margin-top: 10px;
}

.personal-info,
.card-info,
.recap-part {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

.personal-info,
.card-info {
  padding: 20px;
}

.recap-part {
  padding: 20px 0;
  height: 460px;
  min-width: 400px;
}

.product,
.line,
.total p {
  margin: 0 20px;
}

.input-infos {
  width: 100%;
  padding: 10px;
}

.infos-p {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

svg {
  color: #519a53;
}

@media (max-width: 800px) {
  h2 {
    text-align: center;
  }

  .payment-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .form-part,
  .recap-part {
    width: 80%;
  }
}
</style>
