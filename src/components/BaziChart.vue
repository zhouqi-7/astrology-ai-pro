<template>
  <div class="bazi-chart">
    <div class="chart-grid">
      <div class="grid-header">
        <div class="cell label">四柱</div>
        <div class="cell label" v-for="p in pillars" :key="p.name">{{ p.name }}</div>
      </div>
      <div class="grid-row">
        <div class="cell label">天干</div>
        <div class="cell gan" v-for="p in pillars" :key="'g'+p.name"
          :style="{ color: wuXingColor[p.ganWuXing] }">
          {{ p.gan }}
          <span class="wu-xing-tag">{{ p.ganWuXing }}</span>
        </div>
      </div>
      <div class="grid-row">
        <div class="cell label">地支</div>
        <div class="cell zhi" v-for="p in pillars" :key="'z'+p.name"
          :style="{ color: wuXingColor[p.zhiWuXing] }">
          {{ p.zhi }}
          <span class="wu-xing-tag">{{ p.zhiWuXing }}</span>
        </div>
      </div>
      <div class="grid-row">
        <div class="cell label">藏干</div>
        <div class="cell cang" v-for="p in pillars" :key="'c'+p.name">
          <span v-for="(cg, i) in p.cangGan" :key="i"
            class="cang-gan" :style="{ color: wuXingColor[ganWuXing(cg)] }">
            {{ cg }}
          </span>
        </div>
      </div>
      <div class="grid-row">
        <div class="cell label">十神</div>
        <div class="cell shishen" v-for="p in pillars" :key="'s'+p.name">
          <span class="shi-shen-tag">{{ p.shiShen }}</span>
        </div>
      </div>
      <div class="grid-row">
        <div class="cell label">纳音</div>
        <div class="cell nayi" v-for="p in pillars" :key="'n'+p.name">
          {{ p.naYin }}
        </div>
      </div>
    </div>

    <div class="chart-footer">
      <div class="info-item">
        <span class="info-label">生肖</span>
        <span class="info-value">{{ shengXiao }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">时辰</span>
        <span class="info-value">{{ hourDisplay }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">日主</span>
        <span class="info-value daymaster">{{ dayGan }}火</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pillars: Array,
  shengXiao: String,
  hourDisplay: String,
  dayGan: String,
})

const wuXingColor = {
  '木': '#6a9a5a',
  '火': '#c4665a',
  '土': '#b89a5a',
  '金': '#b0a898',
  '水': '#5a8a9a',
}

function ganWuXing(gan) {
  const map = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }
  return map[gan] || ''
}
</script>

<style scoped>
.bazi-chart {
  width: 100%;
}

.chart-grid {
  display: grid;
  grid-template-columns: 70px repeat(4, 1fr);
  gap: 1px;
  background: var(--border-gold);
  border-radius: 8px;
  overflow: hidden;
}

.cell {
  background: rgba(28, 23, 20, 0.6);
  padding: 12px 8px;
  text-align: center;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 48px;
}

.cell.label {
  font-family: var(--font-chinese);
  font-size: 13px;
  color: var(--text-secondary);
  background: rgba(196, 154, 74, 0.05);
  letter-spacing: 1px;
  font-weight: 600;
}

.cell.gan,
.cell.zhi {
  font-family: var(--font-chinese);
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 2px;
  padding: 16px 8px;
  background: rgba(28, 23, 20, 0.4);
}

.wu-xing-tag {
  font-family: var(--font-sans);
  font-size: 10px;
  opacity: 0.6;
  font-weight: 400;
}

.cang-gan {
  font-family: var(--font-chinese);
  font-size: 14px;
  margin: 0 3px;
  font-weight: 600;
}

.shi-shen-tag {
  font-family: var(--font-chinese);
  font-size: 13px;
  color: var(--gold);
  font-weight: 600;
}

.nayi {
  font-family: var(--font-chinese);
  font-size: 13px;
  color: var(--text-secondary);
}

.chart-footer {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  padding: 16px 20px;
  background: rgba(196, 154, 74, 0.04);
  border-radius: 8px;
  border: 1px solid var(--border-gold);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.info-value {
  font-family: var(--font-chinese);
  font-size: 16px;
  color: var(--gold);
  font-weight: 700;
}

.info-value.daymaster {
  color: var(--teal);
}

@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: 50px repeat(4, 1fr);
  }
  .cell.gan, .cell.zhi {
    font-size: 22px;
  }
  .chart-footer {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
