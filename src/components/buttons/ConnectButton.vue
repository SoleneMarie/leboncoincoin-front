<script setup>
import { RouterLink } from 'vue-router'
import { inject } from 'vue'

const Store = inject('GlobalStore')
</script>

<template>
  <RouterLink to="/login" class="button-link">
    <font-awesome-icon :icon="['fas', 'user']" />
    <p v-if="!Store.userToken.value">Se connecter</p>
    <p v-else>{{ Store.userName.value }}</p>
  </RouterLink>
</template>

<style scoped>
.button-link {
  display: flex;
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: column;
  background-color: white;
  border: solid 1px #eadfdb;
  width: 80px;
}

.button-link p {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.button-link svg {
  font-size: 18px;
}
</style>
