<script setup></script>

<template>
  <div class="categories-container">
    <p class="category">Immobilier</p>
    <p class="separator">·</p>
    <p class="category">Véhicules</p>
    <p class="separator">·</p>
    <p class="category">Locations de vacances</p>
    <p class="separator">·</p>
    <p class="category">Emploi</p>
    <p class="separator">·</p>
    <p class="category">Mode</p>
    <p class="separator">·</p>
    <p class="category">Maison & Jardin</p>
    <p class="separator">·</p>
    <p class="category">Famille</p>
    <p class="separator">·</p>
    <p class="category">Electronique</p>
    <p class="separator">·</p>
    <p class="category">Loisirs</p>
    <p class="separator">·</p>
    <p class="category">Autres</p>
  </div>
</template>

<style scoped>
.categories-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  width: 100%;
}

.category {
  cursor: pointer;
  font-size: 13px;
}

.separator {
  font-size: 24px;
  margin-bottom: 4px;
}

p {
  white-space: nowrap;
}

@media (max-width: 800px) {
  .categories-container {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
