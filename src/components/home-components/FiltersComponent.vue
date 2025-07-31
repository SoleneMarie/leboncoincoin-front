<script setup>
import { ref } from 'vue'

const emit = defineEmits(['apply-filters'])

const minPrice = ref('')
const maxPrice = ref('')
const sortOrder = ref('none')

const applyFilters = () => {
  emit('apply-filters', {
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    sortOrder: sortOrder.value,
  })
}
</script>

<template>
  <form @submit.prevent="applyFilters">
    <div class="price-limits">
      <h4>Prix</h4>
      <div class="price-limits-inputs">
        <div class="input">
          <input type="number" id="min-price" name="min-price" v-model="minPrice" />
          <p>€</p>
        </div>
        <div class="input">
          <input type="number" id="max-price" name="min-price" v-model="maxPrice" />
          <p>€</p>
        </div>
      </div>
    </div>
    <div class="price-order">
      <h4>Tri</h4>
      <div class="price-order-inputs">
        <label>
          Prix croissant
          <input type="radio" name="sort" value="asc" v-model="sortOrder" />
        </label>
        <label>
          Prix décroissant
          <input type="radio" name="sort" value="desc" v-model="sortOrder" />
        </label>
        <label
          >Pas de tri
          <input type="radio" name="sort" value="none" v-model="sortOrder" />
        </label>
      </div>
    </div>
    <div class="search-button">
      <button @click="applyFilters">Rechercher</button>
    </div>
  </form>
</template>

<style scoped>
form {
  padding: 0 10px;
  margin-bottom: 20px;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
}

h4 {
  margin-bottom: 12px;
  font-weight: bold;
}

.price-limits-inputs {
  display: flex;
  gap: 12px;
}

.price-limits-inputs > div {
  display: flex;
}

.input {
  border: solid 1px #eadfdb;
  border-radius: 20px;
  box-sizing: border-box;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.price-limits-inputs input {
  border: none;
  padding: 0 10px;
  width: 120px;
}

input:focus {
  outline: none;
}

.input p {
  border-left: solid 1px #eadfdb;
  height: 40px;
  padding: 0 10px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 600;
}

.search-button {
  margin-top: auto;
}

button {
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  gap: 4px;
  color: #f9eeea;
  font-weight: bold;
  border: none;
  background-color: #ec5a12;
  align-self: baseline;
  width: 100px;
}

.price-order {
  max-width: 420px;
}

.price-order-inputs {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.price-order-inputs input {
  width: 16px;
  height: 16px;
  margin-bottom: 6px;
  cursor: pointer;
}

.price-order-inputs label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
</style>
