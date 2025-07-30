<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import PutOfferButton from '../buttons/PutOfferButton.vue'
import ConnectButton from '../buttons/ConnectButton.vue'
import SearchBar from './SearchBar.vue'
import SelectType from './SelectType.vue'

const searchValue = ref('')
</script>

<template>
  <header>
    <section>
      <RouterLink to="/" class="image-div">
        <img src="/src/assets/images/logo.svg" alt="logo leboncoin" />
      </RouterLink>
      <div class="actions">
        <PutOfferButton />
        <SearchBar v-model:searchValue="searchValue" />
      </div>
      <div>
        <ConnectButton />
      </div>
    </section>
    <section>
      <SelectType />
    </section>
  </header>
</template>

<style scoped>
header {
  padding: 12px 0;
  margin-bottom: 20px;
  border-bottom: solid 1px #e3e6e8;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: white;
}

section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-div {
  width: 160px;
  height: 50px;
}

img {
  height: 100%;
  width: 100%;
  cursor: pointer;
  object-fit: contain;
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 60%;
}
</style>
