<script setup>
import { useRouter } from 'vue-router'

const { searchValue } = defineProps({
  searchValue: String,
})

const emit = defineEmits(['update:searchValue'])

const router = useRouter()

const onInput = (event) => {
  const value = event.target.value
  emit('update:searchValue', value)
  if (value === '') {
    handleSearchInput()
  }
}

const handleSearchInput = () => {
  const trimmed = searchValue.trim()
  router.push({
    name: 'home',
    query: trimmed ? { title: trimmed } : {},
  })
}
</script>

<template>
  <div>
    <input
      id="searchbar"
      type="text"
      placeholder="Rechercher sur leboncoin"
      :value="searchValue"
      @input="onInput"
      @keydown.enter="handleSearchInput"
    />
    <font-awesome-icon :icon="['fas', 'search']" @click="handleSearchInput" />
  </div>
</template>

<style scoped>
div {
  position: relative;
  flex: 1;
  margin-right: 40px;
}

input {
  padding: 10px 40px 10px 6px;
  border: solid 1px #eadfdb;
  border-radius: 10px;
  width: 100%;
}

input:focus-visible {
  outline: none;
}

div svg {
  position: absolute;
  top: 5px;
  right: -40px;
  font-size: 14px;
  background-color: #ec5a12;
  padding: 5px 4px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
