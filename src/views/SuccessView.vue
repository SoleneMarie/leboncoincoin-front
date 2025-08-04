<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="page-feedback">
    <h1>✅ Merci !</h1>
    <p>Votre achat a été réalisé avec succès.</p>
    <RouterLink to="/" class="btn">Retour à l'accueil</RouterLink>
  </section>
</template>

<style scoped>
.page-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

h1 {
  color: green;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

p {
  margin-bottom: 10px;
}

.btn {
  margin-top: 1rem;
  font-size: 14px;
  font-weight: 600;
  background-color: #ec5a12;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  text-decoration: none;
}
</style>
