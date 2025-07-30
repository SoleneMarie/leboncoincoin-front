<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import HomeBanner from '@/components/home-components/HomeBanner.vue'
import OffersGrid from '@/components/home-components/OffersGrid.vue'
const offers = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      'https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/offers?populate[pictures]=*&populate[owner][populate]=avatar',
    )
    offers.value = data.data
    console.log('offres récupérées :', data.data)
  } catch (error) {
    console.log('Erreur à la récupération des annonces :', error)
  }
})
</script>

<template>
  <main>
    <HomeBanner />
    <OffersGrid :offers="offers" />
  </main>
</template>

<style scoped></style>
