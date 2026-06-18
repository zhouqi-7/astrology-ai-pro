<template>
  <div class="dayun-timeline">
    <div class="current-yun-info" v-if="currentDaYun">
      <div class="current-label">当前大运</div>
      <div class="current-name">{{ currentDaYun.gan }}{{ currentDaYun.zhi }}</div>
      <div class="current-age">{{ currentDaYun.ageStart }}–{{ currentDaYun.ageStart + 9 }}岁 ({{ currentDaYun.yearStart }}–{{ currentDaYun.yearEnd }})</div>
    </div>

    <div class="timeline">
      <div v-for="(yun, i) in daYun" :key="i"
        class="timeline-item"
        :class="{ active: yun.name === currentDaYun?.name }">
        <div class="timeline-dot" :class="{ active: yun.name === currentDaYun?.name }" />
        <div class="timeline-content">
          <div class="yun-name">{{ yun.gan }}{{ yun.zhi }}</div>
          <div class="yun-age">{{ yun.ageStart }}–{{ yun.ageStart + 9 }}岁</div>
          <div class="yun-years">{{ yun.yearStart }}–{{ yun.yearEnd }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  daYun: Array,
  currentDaYun: Object,
})
</script>

<style scoped>
.current-yun-info {
  text-align: center;
  padding: 24px;
  margin-bottom: 28px;
  background: linear-gradient(135deg, rgba(196, 154, 74, 0.08), rgba(106, 158, 138, 0.05));
  border-radius: 12px;
  border: 1px solid var(--gold-dim);
}

.current-label {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.current-name {
  font-family: var(--font-chinese);
  font-size: 36px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold), var(--teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
}

.current-age {
  font-size: 14px;
  color: var(--text-secondary);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--border-gold), rgba(196, 154, 74, 0.05));
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 16px 0;
  position: relative;
  transition: all 0.3s;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border-gold);
  background: var(--bg-primary);
  flex-shrink: 0;
  margin-top: 4px;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.timeline-dot.active {
  border-color: var(--gold);
  background: var(--gold);
  box-shadow: 0 0 20px rgba(196, 154, 74, 0.4);
}

.timeline-content {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.timeline-item.active .timeline-content {
  background: var(--gold-dim);
  border-radius: 8px;
  padding: 8px 16px;
  margin: -8px -16px;
}

.yun-name {
  font-family: var(--font-chinese);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.timeline-item.active .yun-name {
  color: var(--gold);
}

.yun-age {
  font-size: 13px;
  color: var(--text-secondary);
}

.yun-years {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .current-name {
    font-size: 28px;
  }
  .timeline-content {
    gap: 8px;
  }
  .yun-name {
    font-size: 16px;
  }
}
</style>
