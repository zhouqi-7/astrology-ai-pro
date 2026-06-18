<template>
  <div class="section-card" :class="{ 'scroll-reveal': animate }" ref="cardRef">
    <div class="card-glow" />
    <div class="card-header">
      <div class="card-icon" v-if="icon">{{ icon }}</div>
      <h2 class="card-title">{{ title }}</h2>
      <div class="card-line" />
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  title: String,
  icon: { type: String, default: '' },
  animate: { type: Boolean, default: true },
})

const cardRef = ref(null)
</script>

<style scoped>
.section-card {
  position: relative;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius);
  padding: 36px 40px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 100% 0%, rgba(196, 154, 74, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-gold);
}

.card-icon {
  font-size: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gold-dim);
  border-radius: 10px;
  flex-shrink: 0;
}

.card-title {
  font-family: var(--font-chinese);
  font-size: 22px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 1px;
}

.card-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border-gold), transparent);
}

.card-body {
  position: relative;
  z-index: 1;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

@media (max-width: 768px) {
  .section-card {
    padding: 24px 20px;
    border-radius: 8px;
  }
  .card-title {
    font-size: 18px;
  }
}
</style>
