<script setup>
import PutOfferButton from '../buttons/PutOfferButton.vue'
</script>

<template>
  <section>
    <div class="banner">
      <div>
        <img src="/images/onde-corail.svg" alt="onde corail" />
      </div>
      <div class="sell">
        <p>C'est le moment de vendre</p>
        <PutOfferButton />
      </div>
      <div>
        <img src="/images/feuille-bleue.svg" alt="onde corail" />
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  margin-bottom: 20px;
}

.banner {
  background-color: #fee9dd;
  height: 80px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner div {
  border-radius: 20px;
}

.banner img {
  object-fit: contain;
  height: 100%;
  width: 100%;
  border-radius: 20px;
}

.sell {
  display: flex;
  align-items: center;
  gap: 14px;
}

p {
  font-weight: bold;
  font-size: 18px;
}
</style>
