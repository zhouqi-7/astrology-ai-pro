<template>
  <div class="five-elements">
    <div class="elements-grid">
      <div v-for="el in elements" :key="el.name" class="element-item">
        <div class="element-ring" :style="{
          '--ring-color': el.color,
          '--ring-percent': el.percent,
        }">
          <svg viewBox="0 0 100 100" class="ring-svg">
            <circle cx="50" cy="50" r="42" class="ring-bg" />
            <circle cx="50" cy="50" r="42" class="ring-progress"
              :style="{
                strokeDasharray: `${264 * el.percent / 100} 264`,
                stroke: el.color,
              }" />
          </svg>
          <div class="ring-center">
            <div class="element-symbol">{{ el.symbol }}</div>
            <div class="element-value">{{ el.value }}</div>
          </div>
        </div>
        <div class="element-name" :style="{ color: el.color }">{{ el.name }}</div>
      </div>
    </div>
    <div class="elements-desc">
      <span v-for="el in sortedElements" :key="el.name" class="stat-bar">
        <span class="stat-label" :style="{ color: el.color }">{{ el.name }}</span>
        <span class="stat-bar-track">
          <span class="stat-bar-fill" :style="{ width: el.percent + '%', background: el.color }" />
        </span>
        <span class="stat-value">{{ el.value }}</span>
      </span>
    </div>
    <div class="wu-xing-summary">
      <span class="summary-text">{{ summaryText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  wuXing: Object,
})

const elementConfig = {
  '木': { symbol: '🌳', color: '#6a9a5a' },
  '火': { symbol: '🔥', color: '#c4665a' },
  '土': { symbol: '⛰️', color: '#b89a5a' },
  '金': { symbol: '⚔️', color: '#b0a898' },
  '水': { symbol: '🌊', color: '#5a8a9a' },
}

const elements = computed(() => {
  const total = Object.values(props.wuXing).reduce((a, b) => a + b, 0) || 1
  return Object.entries(props.wuXing).map(([name, value]) => ({
    name,
    value,
    percent: Math.round((value / total) * 100),
    ...elementConfig[name],
  }))
})

const sortedElements = computed(() =>
  [...elements.value].sort((a, b) => b.value - a.value)
)

const summaryText = computed(() => {
  const top = sortedElements.value[0]
  const least = sortedElements.value[sortedElements.value.length - 1]
  return `五行${top.name}最旺，${least.name}偏弱。整体${Object.values(props.wuXing).every(v => v > 0) ? '五行齐全，流通有情' : '五行有缺，需注意调和'}。`
})
</script>

<style scoped>
.elements-grid {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-bottom: 28px;
}

.element-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.element-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 6;
}

.ring-progress {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.element-symbol {
  font-size: 18px;
  line-height: 1;
}

.element-value {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.element-name {
  font-family: var(--font-chinese);
  font-size: 15px;
  font-weight: 700;
}

.elements-desc {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 8px;
}

.stat-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-label {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 700;
  width: 24px;
  text-align: right;
}

.stat-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.stat-value {
  font-size: 13px;
  color: var(--text-secondary);
  width: 24px;
  text-align: right;
  font-weight: 600;
}

.wu-xing-summary {
  margin-top: 20px;
  padding: 14px 20px;
  background: rgba(196, 154, 74, 0.05);
  border-radius: 8px;
  border: 1px solid var(--border-gold);
  text-align: center;
}

.summary-text {
  font-family: var(--font-chinese);
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .elements-grid {
    gap: 16px;
    flex-wrap: wrap;
  }
  .element-ring {
    width: 64px;
    height: 64px;
  }
}
</style>
