<template>
  <div class="taiyi">
    <div class="page-hero">
      <div class="hero-bg">☯</div>
      <h1 class="hero-title">太乙神数</h1>
      <p class="hero-desc">太乙积年 · 九宫定局 · 十六神</p>
    </div>

    <div class="form-section">
      <div class="form-card">
        <div class="form-header">
          <span class="form-icon">📅</span>
          <span>推演太乙</span>
        </div>
        <p class="form-hint">选择公历年份，系统将根据太乙神数法则推算本年天象格局。</p>
        <el-form class="taiyi-form" @submit.prevent="calculate">
          <div class="form-row">
            <el-form-item label="年">
              <el-input-number v-model="year" :min="1900" :max="2100" size="large" controls-position="right" />
            </el-form-item>
            <el-form-item label="月">
              <el-input-number v-model="month" :min="1" :max="12" size="large" controls-position="right" />
            </el-form-item>
            <el-form-item label="日">
              <el-input-number v-model="day" :min="1" :max="31" size="large" controls-position="right" />
            </el-form-item>
          </div>
          <el-button type="primary" size="large" class="cast-btn" @click="calculate">
            推演
          </el-button>
        </el-form>
      </div>
    </div>

    <div class="result-section" v-if="result">
      <SectionCard title="太乙神数推演" icon="☯">
        <div class="info-bar">
          <div class="info-item">
            <span class="info-label">积年</span>
            <span class="info-val jinian">{{ result.jiNian.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">周天</span>
            <span class="info-val">第{{ result.cycleYear }}年 / 24年</span>
          </div>
          <div class="info-item">
            <span class="info-label">太乙</span>
            <span class="info-val taiyi-star">{{ result.taiYi.name }}({{ result.taiYi.palace }})</span>
          </div>
          <div class="info-item">
            <span class="info-label">文昌</span>
            <span class="info-val wenchang">{{ result.wenChang.name }}({{ result.wenChang.palace }})</span>
          </div>
          <div class="info-item">
            <span class="info-label">主算</span>
            <span class="info-val zhu">{{ result.zhuSuan }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客算</span>
            <span class="info-val ke">{{ result.keSuan }}</span>
          </div>
        </div>

        <div class="jiugong-header">九宫格局</div>
        <div class="jiugong-grid">
          <div v-for="pos in gridOrder" :key="pos" class="jiugong-cell"
            :class="{ center: pos === 5, 'has-taiyi': result.pan[pos].stars.includes('太乙'), 'has-wenchang': result.pan[pos].stars.includes('文昌') }">
            <div class="cell-header">
              <span class="cell-bagua">{{ result.pan[pos].name }}</span>
              <span class="cell-dir">{{ result.pan[pos].direction }}</span>
            </div>
            <div class="cell-element">{{ result.pan[pos].element }}</div>
            <div class="cell-stars">
              <span v-for="star in result.pan[pos].stars" :key="star"
                class="star-tag"
                :class="{ 'star-taiyi': star === '太乙', 'star-wenchang': star === '文昌', 'star-other': star !== '太乙' && star !== '文昌' }">
                {{ star }}
              </span>
            </div>
            <div class="cell-shen" v-if="result.pan[pos].shenList.length">
              <span v-for="s in result.pan[pos].shenList" :key="s" class="shen-tag">{{ s }}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="十六神分布" icon="📜">
        <div class="shen-grid">
          <div v-for="s in shenList" :key="s.name" class="shen-item">
            <span class="shen-name">{{ s.name }}</span>
            <span class="shen-arrow">→</span>
            <span class="shen-palace">{{ s.palaceName }}({{ s.palaceNum }})</span>
          </div>
        </div>
      </SectionCard>
    </div>
    <TheoryInfo title="太乙神数" :sections="taiyiTheory" :sources="taiyiSources"></TheoryInfo>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { calculateTaiYi } from '@/data/taiyi.js'
import SectionCard from '@/components/SectionCard.vue'
import TheoryInfo from '@/components/TheoryInfo.vue'

const taiyiTheory = [
  { heading: '历史渊源', lines: ['太乙神数是三式之首，最早见于《易纬乾凿度》。唐代王希明《太乙金镜式经》为现存最早的系统著作，传说源于黄帝时期，用于推演国家气运。'] },
  { heading: '积年与周天', lines: ['太乙积年起于上古甲子年：积年 = 公元年 + 10153917。', '太乙24年遍历8宫（每宫3年），行宫顺序：乾→离→艮→震→兑→坤→坎→巽，逢中五宫不居。'] },
  { heading: '十六神系统', lines: ['12地支加乾、巽、艮、坤四维，共十六神。每神对应固定宫位：子→坎1, 丑艮寅→艮8, 卯→震3, 辰巽巳→巽4, 午→离9, 未坤申→坤2, 酉→兑7, 戌乾亥→乾6。', '宫中十六神的数量反映了该宫的能量密度与吉凶属性。'] },
  { heading: '主客算与星神', lines: ['文昌与太乙相对位（文昌宫 = 10 - 太乙宫）。', '主算以文昌宫数为基，客算以太乙宫数为基，结合计神、主客大将等判断主客方形势。'] },
]
const taiyiSources = ['王希明《太乙金镜式经》', '《易纬乾凿度》', '《太乙神数》（清代）']

const year = ref(2026)
const month = ref(6)
const day = ref(18)
const result = ref(null)

const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6]

const PALACE_NAMES = { 1: '坎', 2: '坤', 3: '震', 4: '巽', 5: '中', 6: '乾', 7: '兑', 8: '艮', 9: '离' }

const shenData = [
  { name: '子神', palaceNum: 1 }, { name: '丑神', palaceNum: 8 },
  { name: '艮神', palaceNum: 8 }, { name: '寅神', palaceNum: 8 },
  { name: '卯神', palaceNum: 3 }, { name: '辰神', palaceNum: 4 },
  { name: '巽神', palaceNum: 4 }, { name: '巳神', palaceNum: 4 },
  { name: '午神', palaceNum: 9 }, { name: '未神', palaceNum: 2 },
  { name: '坤神', palaceNum: 2 }, { name: '申神', palaceNum: 2 },
  { name: '酉神', palaceNum: 7 }, { name: '戌神', palaceNum: 6 },
  { name: '乾神', palaceNum: 6 }, { name: '亥神', palaceNum: 6 },
]

const shenList = computed(() => {
  return shenData.map(s => ({ ...s, palaceName: PALACE_NAMES[s.palaceNum] }))
})

function calculate() {
  try {
    result.value = calculateTaiYi({
      year: year.value,
      month: month.value,
      day: day.value,
    })
  } catch (e) {
    console.error('推演错误:', e)
  }
}

calculate()
</script>

<style scoped>
.taiyi {
  min-height: 100vh;
  padding-bottom: 80px;
}

.page-hero {
  text-align: center;
  padding: 80px 24px 40px;
  position: relative;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 200px;
  opacity: 0.04;
  pointer-events: none;
  font-family: serif;
}

.hero-title {
  font-family: var(--font-chinese);
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px;
}

.hero-desc {
  font-family: var(--font-chinese);
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
}

.form-section {
  max-width: 640px;
  margin: 0 auto 32px;
  padding: 0 24px;
}

.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 14px;
  padding: 28px;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-chinese);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-icon {
  font-size: 22px;
}

.form-hint {
  font-family: var(--font-chinese);
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-row .el-form-item {
  flex: 1;
  min-width: 100px;
}

.cast-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  font-size: 16px;
  font-family: var(--font-chinese);
  letter-spacing: 2px;
}

.result-section {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 10px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-family: var(--font-chinese);
  font-size: 13px;
  color: var(--text-secondary);
}

.info-val {
  font-family: var(--font-chinese);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.jinian {
  font-size: 13px !important;
  font-family: monospace;
  color: var(--gold) !important;
}

.taiyi-star { color: #f56c6c; }
.wenchang { color: #67c23a; }
.zhu { color: #e6a23c; }
.ke { color: #409eff; }

.jiugong-header {
  font-family: var(--font-chinese);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
  text-align: center;
}

.jiugong-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2px;
  max-width: 600px;
  margin: 0 auto;
  background: var(--border-gold);
  border: 2px solid var(--border-gold);
  border-radius: 8px;
  overflow: hidden;
}

.jiugong-cell {
  background: var(--bg-card);
  padding: 12px 8px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  transition: background 0.2s;
}

.jiugong-cell:hover {
  background: var(--gold-dim);
}

.jiugong-cell.center {
  background: var(--bg-secondary);
  opacity: 0.7;
}

.jiugong-cell.has-taiyi {
  background: rgba(245, 108, 108, 0.08);
  border: 1px solid rgba(245, 108, 108, 0.3);
}

.jiugong-cell.has-wenchang {
  background: rgba(103, 194, 58, 0.08);
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.jiugong-cell.has-taiyi.has-wenchang {
  background: linear-gradient(135deg, rgba(245,108,108,0.08), rgba(103,194,58,0.08));
}

.cell-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-chinese);
  font-size: 12px;
  color: var(--text-secondary);
}

.cell-bagua {
  font-weight: 700;
  font-size: 15px;
  color: var(--gold);
}

.cell-element {
  font-family: var(--font-chinese);
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.cell-stars {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 4px 0;
}

.star-tag {
  font-family: var(--font-chinese);
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.star-taiyi {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.15);
  font-size: 14px;
}

.star-wenchang {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.15);
}

.star-other {
  color: #409eff;
  background: rgba(64, 158, 255, 0.12);
  font-size: 11px;
}

.cell-shen {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  margin-top: 4px;
}

.shen-tag {
  font-family: var(--font-chinese);
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  opacity: 0.8;
}

.shen-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.shen-item {
  padding: 10px 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-chinese);
  font-size: 13px;
}

.shen-name {
  font-weight: 600;
  color: var(--text-primary);
}

.shen-arrow {
  color: var(--text-secondary);
  font-size: 12px;
}

.shen-palace {
  color: var(--gold);
  font-size: 12px;
}

@media (max-width: 640px) {
  .jiugong-cell {
    padding: 8px 4px;
    min-height: 80px;
  }
  .shen-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
