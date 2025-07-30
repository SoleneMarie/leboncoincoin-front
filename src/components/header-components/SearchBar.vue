<script setup>
const { searchValue } = defineProps({
  searchValue: String,
})

const emit = defineEmits(['update:searchValue'])
</script>

<template>
  <div>
    <input
      id="searchbar"
      type="text"
      placeholder="Rechercher sur leboncoin"
      :value="searchValue"
      @input="emit('update:searchValue', $event.target.value)"
    />
    <font-awesome-icon :icon="['fas', 'search']" />
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
