<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink to="/publish" class="">
    <button>
      <font-awesome-icon :icon="['fas', 'plus-square']" />
      <p>Déposer une annonce</p>
    </button>
  </RouterLink>
</template>

<style scoped>
@media (max-width: 860px) {
  p {
    display: none;
  }
}

button {
  display: flex;
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #f9eeea;
  font-weight: bold;
  border: none;
  background-color: #ec5a12;
}
</style>
