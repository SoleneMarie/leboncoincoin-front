<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const goToPage = (page) => {
  emit('page-change', page)
}

// Calcule les pages à afficher (max 10)
const getPageRange = () => {
  const range = []
  const maxVisible = 10
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1

  if (end > props.totalPages) {
    end = props.totalPages
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
}
</script>
<template>
  <div>
    <font-awesome-icon
      v-if="currentPage > 1"
      :icon="['fas', 'angle-left']"
      @click="goToPage(currentPage - 1)"
    />
    <font-awesome-icon v-else :icon="['fas', 'angle-left']" class="desactivated" />
    <button
      v-for="page in getPageRange()"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="goToPage(page)"
      :disabled="page === currentPage"
    >
      {{ page }}
    </button>
    <font-awesome-icon
      v-if="currentPage < totalPages"
      :icon="['fas', 'angle-right']"
      @click="goToPage(currentPage + 1)"
    />
    <font-awesome-icon v-else :icon="['fas', 'angle-right']" class="desactivated" />
  </div>
</template>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}

button {
  padding: 6px 14px;
  border: none;
  margin: 2px;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

button.active {
  font-weight: bold;
  background-color: navy;
  color: white;
}

.desactivated {
  opacity: 0.3;
  pointer-events: none;
  cursor: default;
}

svg {
  cursor: pointer;
  margin: 0 12px;
}
</style>
