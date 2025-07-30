<script setup>
import { RouterView } from 'vue-router'
import HeaderView from './components/header-components/HeaderView.vue'
import FooterView from './components/footer-components/FooterView.vue'
</script>

<template>
  <div class="wrapper">
    <HeaderView />
    <RouterView />
    <FooterView />
  </div>
</template>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>
