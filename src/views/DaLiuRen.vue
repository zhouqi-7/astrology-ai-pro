<template>
  <div class="liuren">
    <div class="page-hero">
      <div class="hero-bg">☰</div>
      <h1 class="hero-title">大六壬</h1>
      <p class="hero-desc">月将加时 · 四课三传 · 十二天将</p>
    </div>

    <div class="form-section">
      <div class="form-card">
        <div class="form-header">
          <span class="form-icon">🕰️</span>
          <span>择时起课</span>
        </div>
        <p class="form-hint">选择公历日期与时辰，系统将根据大六壬法则为你排盘。</p>
        <el-form class="liuren-form" @submit.prevent="calculate">
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
            <el-form-item label="时辰">
              <el-select v-model="hour" size="large" style="width:120px">
                <el-option v-for="s in shiChenList" :key="s.value" :label="s.label" :value="s.value" />
              </el-select>
            </el-form-item>
          </div>
          <el-button type="primary" size="large" class="cast-btn" @click="calculate">
            起课
          </el-button>
        </el-form>
      </div>
    </div>

    <div class="result-section" v-if="result">
      <SectionCard title="大六壬排盘" icon="☰">
        <div class="info-bar">
          <div class="info-item">
            <span class="info-label">四柱</span>
            <span class="info-val sizhu">{{ result.sizhu.year }} {{ result.sizhu.month }} {{ result.sizhu.day }} {{ result.sizhu.hour }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">月将</span>
            <span class="info-val yuejiang">{{ result.yueJiang.name }}({{ result.yueJiang.zhi }})</span>
          </div>
          <div class="info-item">
            <span class="info-label">占时</span>
            <span class="info-val">{{ result.zhanShi }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">日干寄宫</span>
            <span class="info-val">{{ result.dayGanJiGong }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">贵人</span>
            <span class="info-val guiren">{{ result.tianJiang.guiRen }}({{ result.tianJiang.isDay ? '昼' : '夜' }})</span>
          </div>
        </div>

        <div class="tiandi-header">天地盘</div>
        <div class="tiandi-grid">
          <div v-for="pos in gridLayout" :key="pos.zhi" class="td-cell"
            :class="{ empty: !pos.zhi }">
            <div v-if="pos.zhi" class="td-inner">
              <span class="td-direction">{{ pos.dir }}</span>
              <span class="td-heaven">{{ result.diPan[pos.zhi].heaven }}</span>
              <span class="td-earth">{{ pos.zhi }}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="四课" icon="📋">
        <div class="sike-grid">
          <div v-for="(ke, i) in result.siKe" :key="i" class="sike-item"
            :class="{ keActive: ke.ke === '上克下', keReverse: ke.ke === '下克上' }">
            <div class="sike-num">{{ ke.name }}</div>
            <div class="sike-desc">{{ ke.desc }}</div>
            <div class="sike-ke" v-if="ke.ke">{{ ke.ke }}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="三传" icon="📿">
        <div class="sanchuan-row">
          <div class="sc-item sc-chu">
            <span class="sc-label">初传</span>
            <span class="sc-zhi">{{ result.sanChuan.chuChuan }}</span>
          </div>
          <span class="sc-arrow">→</span>
          <div class="sc-item sc-zhong">
            <span class="sc-label">中传</span>
            <span class="sc-zhi">{{ result.sanChuan.zhongChuan }}</span>
          </div>
          <span class="sc-arrow">→</span>
          <div class="sc-item sc-mo">
            <span class="sc-label">末传</span>
            <span class="sc-zhi">{{ result.sanChuan.moChuan }}</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="十二天将" icon="🌟">
        <div class="tianjiang-grid">
          <div v-for="zhi in zhiList" :key="zhi" class="tj-cell">
            <span class="tj-zhi">{{ zhi }}</span>
            <span class="tj-jiang" v-if="result.diPan[zhi].jiang">
              {{ result.diPan[zhi].jiang }}
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
    <TheoryInfo title="大六壬" :sections="liurenTheory" :sources="liurenSources" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { calculateLiuRen } from '@/data/liuren.js'
import SectionCard from '@/components/SectionCard.vue'
import TheoryInfo from '@/components/TheoryInfo.vue'

const liurenTheory = [
  { heading: '历史渊源', lines: ['大六壬是中国最早的术数之一，与太乙、奇门并称三式。战国时期已有记载，《六壬大全》《大六壬指南》为明清集大成之作。'] },
  { heading: '月将与天地盘', lines: ['月将即太阳所在宫位，以中气（雨水、春分、谷雨、小满、夏至、大暑、处暑、秋分、霜降、小雪、冬至、大寒）为界转换。', '雨水→亥(登明), 春分→戌(河魁), 谷雨→酉(从魁), 小满→申(传送), 夏至→未(小吉), 大暑→午(胜光), 处暑→巳(太乙), 秋分→辰(天罡), 霜降→卯(太冲), 小雪→寅(功曹), 冬至→丑(大吉), 大寒→子(神后)。', '月将加临占时地支，形成天地盘12地支旋转映射。'] },
  { heading: '四课推演', lines: ['日干寄宫（甲寅、乙辰、丙巳、丁未、戊巳、己未、庚申、辛戌、壬亥、癸丑）。', '取干上神（日干寄宫的天盘）为第一课，干上之阴（第一课的天盘）为第二课。', '取支上神（日支的天盘）为第三课，支上之阴（第三课的天盘）为第四课。'] },
  { heading: '三传与克应', lines: ['贼克法优先取上克下，次取下克上。初传、中传、末传构成事件发展的三个阶段。', '初传取自四课中的克应关系，中传=初传的天盘，末传=中传的天盘。'] },
  { heading: '十二天将系统', lines: ['贵人起法口诀：甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢虎马。', '卯时至申时为昼占用阳贵，酉时至寅时为夜占用阴贵。', '贵人从亥至辰为顺行十二天将，从巳至戌为逆行。天将顺序：贵人→腾蛇→朱雀→六合→勾陈→青龙→天空→白虎→太常→玄武→太阴→天后。'] },
]
const liurenSources = ['徐次宾《六壬神课》', '佚名《六壬大全》', '陈公献《大六壬指南》', '《六壬粹言》（清代）']

const year = ref(2026)
const month = ref(6)
const day = ref(18)
const hour = ref(11)
const result = ref(null)

const shiChenList = [
  { value: 0, label: '子时 23-01' },
  { value: 1, label: '丑时 01-03' },
  { value: 2, label: '寅时 03-05' },
  { value: 3, label: '卯时 05-07' },
  { value: 4, label: '辰时 07-09' },
  { value: 5, label: '巳时 09-11' },
  { value: 6, label: '午时 11-13' },
  { value: 7, label: '未时 13-15' },
  { value: 8, label: '申时 15-17' },
  { value: 9, label: '酉时 17-19' },
  { value: 10, label: '戌时 19-21' },
  { value: 11, label: '亥时 21-23' },
]

const gridLayout = [
  { zhi: '巳', dir: '东南' }, { zhi: '午', dir: '南' }, { zhi: '未', dir: '西南' }, { zhi: '申', dir: '西' },
  { zhi: '辰', dir: '东' }, { zhi: '', dir: '' }, { zhi: '', dir: '' }, { zhi: '酉', dir: '西' },
  { zhi: '卯', dir: '东' }, { zhi: '', dir: '' }, { zhi: '', dir: '' }, { zhi: '戌', dir: '西北' },
  { zhi: '寅', dir: '东北' }, { zhi: '丑', dir: '东北' }, { zhi: '子', dir: '北' }, { zhi: '亥', dir: '西北' },
]

const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

function calculate() {
  try {
    const h = hour.value * 2
    result.value = calculateLiuRen({
      year: year.value,
      month: month.value,
      day: day.value,
      hour: h,
    })
  } catch (e) {
    console.error('起课错误:', e)
  }
}

calculate()
</script>

<style scoped>
.liuren {
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

.sizhu {
  letter-spacing: 4px;
  font-size: 17px !important;
}

.yuejiang { color: #e6a23c; }
.guiren { color: #67c23a; }

.tiandi-header {
  font-family: var(--font-chinese);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
  text-align: center;
}

.tiandi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  max-width: 560px;
  margin: 0 auto;
}

.td-cell {
  aspect-ratio: 1;
  min-height: 70px;
}

.td-cell.empty {
  visibility: hidden;
}

.td-inner {
  height: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px;
  position: relative;
}

.td-direction {
  position: absolute;
  top: 3px;
  left: 6px;
  font-family: var(--font-chinese);
  font-size: 9px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.td-heaven {
  font-family: var(--font-chinese);
  font-size: 24px;
  font-weight: 700;
  color: var(--gold);
  line-height: 1.2;
}

.td-earth {
  font-family: var(--font-chinese);
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.sike-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.sike-item {
  padding: 16px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--font-chinese);
}

.sike-item.keActive {
  border-color: #f56c6c;
  background: rgba(245, 108, 108, 0.08);
}

.sike-item.keReverse {
  border-color: #e6a23c;
  background: rgba(230, 162, 60, 0.08);
}

.sike-num {
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
}

.sike-desc {
  font-size: 15px;
  color: var(--text-primary);
}

.sike-ke {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin: 0 auto;
}

.keActive .sike-ke { background: rgba(245, 108, 108, 0.2); color: #f56c6c; }
.keReverse .sike-ke { background: rgba(230, 162, 60, 0.2); color: #e6a23c; }

.sanchuan-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  font-family: var(--font-chinese);
}

.sc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 24px;
  border-radius: 10px;
  border: 1px solid var(--border-gold);
}

.sc-chu { background: rgba(245, 108, 108, 0.1); border-color: #f56c6c; }
.sc-zhong { background: rgba(230, 162, 60, 0.1); border-color: #e6a23c; }
.sc-mo { background: rgba(103, 194, 58, 0.1); border-color: #67c23a; }

.sc-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.sc-zhi {
  font-size: 28px;
  font-weight: 700;
}

.sc-chu .sc-zhi { color: #f56c6c; }
.sc-zhong .sc-zhi { color: #e6a23c; }
.sc-mo .sc-zhi { color: #67c23a; }

.sc-arrow {
  font-size: 24px;
  color: var(--text-secondary);
}

.tianjiang-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

.tj-cell {
  padding: 12px 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-chinese);
}

.tj-zhi {
  font-size: 18px;
  font-weight: 700;
  color: var(--gold);
}

.tj-jiang {
  font-size: 12px;
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .sike-grid { grid-template-columns: repeat(2, 1fr); }
  .tianjiang-grid { grid-template-columns: repeat(3, 1fr); }
  .sanchuan-row { flex-direction: column; }
  .sc-arrow { transform: rotate(90deg); }
}
</style>
