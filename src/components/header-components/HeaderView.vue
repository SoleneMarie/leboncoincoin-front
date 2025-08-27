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
    <section class="main">
      <RouterLink to="/" class="image-div">
        <img src="/src/assets/images/logo.svg" alt="logo leboncoin" />
      </RouterLink>
      <div class="right-side">
        <div class="actions">
          <PutOfferButton />
          <SearchBar v-model:searchValue="searchValue" />
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </section>
    <section class="select">
      <SelectType />
    </section>
  </header>
</template>

<style scoped>
@media (max-width: 600px) {
  .main {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .image-div {
    width: 100%;
    height: 50px;
    margin-bottom: 12px;
  }
}
@media (min-width: 601px) {
  .main {
    display: flex;
    gap: 60px;
  }

  .image-div {
    width: 160px;
    height: 50px;
  }
}

header {
  padding: 12px 0;
  margin-bottom: 20px;
  border-bottom: solid 1px #e3e6e8;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: white;
  box-sizing: border-box;
}

header > section:first-child {
  margin-bottom: 12px;
}

section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  height: 100%;
  width: 100%;
  cursor: pointer;
  object-fit: contain;
}

.right-side {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 75%;
  box-sizing: border-box;
}

</style>
