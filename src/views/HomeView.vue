<script setup>
import axios from 'axios'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import HomeBanner from '@/components/home-components/HomeBanner.vue'
import FiltersComponent from '@/components/home-components/FiltersComponent.vue'
import OffersGrid from '@/components/home-components/OffersGrid.vue'
import PaginationController from '@/components/PaginationController.vue'

const props = defineProps({
  title: String,
  page: Number,
  pageSize: Number,
})

const route = useRoute()

const offers = ref([])
let totalPages = ref(1)

watchEffect(async () => {
  const title = props.title
  const page = props.page
  const pageSize = props.pageSize
  const minPrice = route.query.minPrice
  const maxPrice = route.query.maxPrice
  const sort = route.query.sort

  const baseUrl = 'https://site--leboncoincoin--dk2vmt6fnyjp.code.run/api/offers'
  const params = new URLSearchParams()

  params.append('pagination[page]', page)
  params.append('pagination[pageSize]', pageSize)
  params.append('populate[pictures]', '*')
  params.append('populate[owner][populate]', 'avatar')
  if (title) params.append('filters[title][$containsi]', title)
  if (minPrice) params.append('filters[price][$gte]', minPrice)
  if (maxPrice) params.append('filters[price][$lte]', maxPrice)
  if (sort && sort !== 'none') params.append('sort', sort)

  try {
    const { data } = await axios.get(`${baseUrl}?${params.toString()}`)
    offers.value = data.data
    totalPages.value = data.meta.pagination.pageCount
  } catch (error) {
    console.error('Erreur à la récupération des annonces :', error)
  }
})

const handlePageChange = (newPage) => {
  router.push({
    name: 'home',
    query: {
      title: props.title,
      page: newPage,
      pageSize: props.pageSize,
    },
  })
}

const handleFilters = ({ minPrice, maxPrice, sortOrder }) => {
  const query = {
    ...route.query,
    page: 1,
  }

  if (minPrice) {
    query.minPrice = minPrice
  } else {
    query.minPrice = 1
  }
  if (maxPrice) {
    query.maxPrice = maxPrice
  } else {
    query.maxPrice = ''
  }
  if (sortOrder !== 'none') query.sort = `price:${sortOrder}`
  else delete query.sort

  router.push({ name: 'home', query })
}
</script>

<template>
  <main>
    <FiltersComponent @apply-filters="handleFilters" />
    <HomeBanner />
    <OffersGrid :offers="offers" />
    <PaginationController
      :currentPage="page"
      :totalPages="totalPages"
      @page-change="handlePageChange"
    />
  </main>
</template>

<style scoped></style>
