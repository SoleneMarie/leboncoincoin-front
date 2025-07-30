<script setup>
defineProps({
  text: String,
  icon: String,
  disabled: Boolean,
})
</script>

<template>
  <button :disabled="disabled">
    <p>{{ text }}</p>
    <font-awesome-icon :icon="icon" />
  </button>
</template>

<style scoped>
button {
  display: flex;
  padding: 10px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #f9eeea;
  font-weight: bold;
  border: none;
  background-color: #ec5a12;
}
</style>
