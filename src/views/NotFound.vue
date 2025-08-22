<template>
  <section>
    <div class="nf-card">
      <div class="nf-hero" aria-hidden="true">😕</div>
      <h1 class="nf-title">Oups… cette page n’existe pas</h1>
      <p class="nf-text">Le lien est peut-être incorrect ou la page a été déplacée.</p>

      <div class="nf-actions">
        <RouterLink :to="{ name: 'home' }" class="btn-primary"> Retourner à l’accueil </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nf-card {
  width: 100%;
  max-width: 680px;
  background: #ffffff;
  border: 1px solid #e3e8ef;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(13, 59, 102, 0.06);
  text-align: center;
}

.nf-hero {
  width: 74px;
  height: 74px;
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
  font-size: 42px;
  background: #f8fbff;
  border: 2px solid #c9d3df;
  border-radius: 50%;
}

.nf-title {
  font-size: 22px;
  font-weight: 800;
  margin: 8px 0 6px;
  color: #17324d;
}

.nf-text {
  color: #706a7d;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 18px;
}

.nf-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  transition:
    box-shadow 0.15s ease,
    transform 0.05s ease;
  outline: none;
  background-color: #ec5a12;
  color: #f9eeea;
  border: none;
  box-shadow: 0 2px 6px rgba(236, 90, 18, 0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(236, 90, 18, 0.28);
}
.btn-primary:focus-visible {
  box-shadow: 0 0 0 3px rgba(236, 90, 18, 0.25);
}

@media (max-width: 520px) {
  .nf-title {
    font-size: 18px;
  }
  .nf-card {
    padding: 22px;
  }
}
</style>
