<template>
  <div class="qimen">
    <div class="page-hero">
      <div class="hero-bg">☯</div>
      <h1 class="hero-title">奇门遁甲</h1>
      <p class="hero-desc">时家转盘 · 拆补法 · 九宫定局</p>
    </div>

    <div class="form-section">
      <div class="form-card">
        <div class="form-header">
          <span class="form-icon">⏰</span>
          <span>择时排盘</span>
        </div>
        <p class="form-hint">选择公历日期与时辰，系统将根据奇门遁甲法则为你排盘解读。</p>
        <el-form class="qimen-form" @submit.prevent="calculate">
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
            排盘
          </el-button>
        </el-form>
      </div>
    </div>

    <div class="result-section" v-if="result">
      <SectionCard title="奇门遁甲排盘" icon="☯">
        <div class="info-bar">
          <div class="info-item">
            <span class="info-label">四柱</span>
            <span class="info-val sizhu">{{ result.sizhu.year }} {{ result.sizhu.month }} {{ result.sizhu.day }} {{ result.sizhu.hour }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">节气</span>
            <span class="info-val">{{ result.term.name }} {{ result.term.yuan }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">遁局</span>
            <span class="info-val dun" :class="result.dungeon.type === '阳' ? 'yang' : 'yin'">{{ result.dungeon.type }}遁{{ result.dungeon.number }}局</span>
          </div>
          <div class="info-item">
            <span class="info-label">旬首</span>
            <span class="info-val">{{ result.xunShou.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">值符</span>
            <span class="info-val zhifu">{{ result.zhifuStar }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">值使</span>
            <span class="info-val zhishi">{{ result.zhishiDoor }}门</span>
          </div>
        </div>

        <div class="jiugong-wrapper">
          <div class="jiugong-title">九宫定局</div>
          <div class="jiugong-grid">
            <div v-for="pos in gridOrder" :key="pos" class="jiugong-cell"
              :class="{ center: pos === 5, [`palace-${pos}`]: true }">
              <div class="cell-header">
                <span class="cell-bagua">{{ palaceMap[pos].bagua }}</span>
                <span class="cell-dir">{{ palaceMap[pos].direction }}</span>
                <span class="cell-zhi">{{ palaceMap[pos].zhi.join('') }}</span>
              </div>
              <div class="cell-stems">
                <span class="earth-stem" :class="stemClass(result.pan[pos].earth)">{{ result.pan[pos].earth || '' }}</span>
                <span class="heaven-stem" :class="stemClass(result.pan[pos].heaven)">{{ result.pan[pos].heaven || '' }}</span>
              </div>
              <div class="cell-star" :class="auspiceClass(result.pan[pos].starAuspice)">
                {{ result.pan[pos].star || '' }}
              </div>
              <div class="cell-door" v-if="pos !== 5" :class="auspiceClass(result.pan[pos].doorAuspice)">
                {{ result.pan[pos].door || '' }}门
              </div>
              <div class="cell-spirit">
                {{ result.pan[pos].spirit || '' }}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="吉凶方位" icon="🧭">
        <div class="direction-analysis">
          <div class="dir-grid">
            <div v-for="pos in [1,8,3,4,9,2,7,6]" :key="pos" class="dir-item"
              :class="{ good: result.pan[pos].doorAuspice === '吉' || result.pan[pos].doorAuspice === '大吉', bad: result.pan[pos].doorAuspice === '凶' }">
              <span class="dir-name">{{ palaceMap[pos].direction }}</span>
              <span class="dir-door" :class="result.pan[pos].doorAuspice === '凶' ? 'bad' : 'good'">{{ result.pan[pos].door || '' }}门</span>
              <span class="dir-star">{{ result.pan[pos].star || '' }}</span>
            </div>
          </div>
          <div class="dir-summary">
            <p><strong>吉门：</strong>
              <span v-for="pos in [1,8,3,4,9,2,7,6]" :key="'g'+pos">
                <span v-if="result.pan[pos].doorAuspice === '吉' || result.pan[pos].doorAuspice === '大吉'"
                  class="tag tag-good">{{ result.pan[pos].door }}门({{ palaceMap[pos].direction }}) </span>
              </span>
            </p>
            <p><strong>凶门：</strong>
              <span v-for="pos in [1,8,3,4,9,2,7,6]" :key="'b'+pos">
                <span v-if="result.pan[pos].doorAuspice === '凶'"
                  class="tag tag-bad">{{ result.pan[pos].door }}门({{ palaceMap[pos].direction }}) </span>
              </span>
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
    <TheoryInfo title="奇门遁甲" :sections="qimenTheory" :sources="qimenSources" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { calculateQiMen } from '@/data/qimen.js'
import SectionCard from '@/components/SectionCard.vue'
import TheoryInfo from '@/components/TheoryInfo.vue'

const qimenTheory = [
  { heading: '历史渊源', lines: ['奇门遁甲源于古代天文历法与兵法，最早见于《风后握奇经》，汉代《太白阴经》有系统记载。明代《奇门遁甲秘笈大全》集大成。'] },
  { heading: '节气定局与拆补法', lines: ['冬至到芒种用阳遁（顺布三奇六仪），夏至到大雪用阴遁（逆布）。每节气分上中下三元，每元5天，用拆补法（节气划元）确定当前局数。', '阳遁局数：冬至174, 小寒285, 大寒396, 立春852, 雨水963, 惊蛰174, 春分396, 清明417, 谷雨528, 立夏417, 小满528, 芒种639。', '阴遁局数：夏至936, 小暑825, 大暑714, 立秋258, 处暑147, 白露936, 秋分714, 寒露693, 霜降582, 立冬693, 小雪582, 大雪471。'] },
  { heading: '排盘算法', lines: ['地盘按局数顺逆布三奇六仪（戊己庚辛壬癸丁丙乙）。', '天盘值符星从旬首所在宫起算，按时干宫位旋转，九星随之顺布。', '八门值使门从旬首地支开始计数步数（每时辰1步），顺布八门。', '八神阳遁顺时针排、阴遁逆时针排。'] },
  { heading: '值符值使系统', lines: ['旬首甲遁于六仪（甲子戊、甲戌己、甲申庚、甲午辛、甲辰壬、甲寅癸）。值符星与值使门均从旬首所在宫起算，值符星随天时变（天盘旋转），值使门随地支转（时辰计数）。'] },
]
const qimenSources = ['佚名《烟波钓叟歌》', '李筌《太白阴经》', '《奇门遁甲秘笈大全》（明代）', '刘伯温《金函玉镜奇门遁甲》（传）']

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

const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6]

const palaceMap = {
  1: { bagua: '坎', direction: '北', zhi: ['子'] },
  2: { bagua: '坤', direction: '西南', zhi: ['未', '申'] },
  3: { bagua: '震', direction: '东', zhi: ['卯'] },
  4: { bagua: '巽', direction: '东南', zhi: ['辰', '巳'] },
  5: { bagua: '', direction: '中', zhi: [] },
  6: { bagua: '乾', direction: '西北', zhi: ['戌', '亥'] },
  7: { bagua: '兑', direction: '西', zhi: ['酉'] },
  8: { bagua: '艮', direction: '东北', zhi: ['丑', '寅'] },
  9: { bagua: '离', direction: '南', zhi: ['午'] },
}

const WU_XING_COLORS = { 木: 'green', 火: 'red', 土: 'brown', 金: 'gold', 水: 'blue' }

function stemClass(stem) {
  if (!stem) return ''
  const wx = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[stem]
  return `wx-${wx}`
}

function auspiceClass(a) {
  if (!a) return ''
  if (a === '大吉' || a === '吉') return 'auspice-good'
  if (a === '凶') return 'auspice-bad'
  return 'auspice-neutral'
}

function calculate() {
  try {
    const h = hour.value * 2
    result.value = calculateQiMen({
      year: year.value,
      month: month.value,
      day: day.value,
      hour: h,
    })
  } catch (e) {
    console.error('排盘错误:', e)
  }
}

calculate()
</script>

<style scoped>
.qimen {
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

.info-val.dun.yang { color: #f56c6c; }
.info-val.dun.yin { color: #409eff; }
.info-val.zhifu { color: #e6a23c; }
.info-val.zhishi { color: #67c23a; }

.sizhu {
  letter-spacing: 4px;
  font-size: 17px !important;
}

.jiugong-wrapper {
  margin-top: 8px;
}

.jiugong-title {
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
  max-width: 720px;
  margin: 0 auto;
  background: var(--border-gold);
  border: 2px solid var(--border-gold);
  border-radius: 8px;
  overflow: hidden;
}

.jiugong-cell {
  background: var(--bg-card);
  padding: 12px 8px;
  min-height: 120px;
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

.cell-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-chinese);
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.cell-bagua {
  font-weight: 700;
  font-size: 13px;
  color: var(--gold);
}

.cell-zhi {
  font-size: 10px;
  opacity: 0.6;
}

.cell-stems {
  display: flex;
  gap: 8px;
  font-family: var(--font-chinese);
  font-size: 18px;
  font-weight: 700;
  margin: 4px 0;
}

.earth-stem {
  color: var(--text-primary);
}

.heaven-stem {
  color: var(--gold);
}

.wx-木 { color: #67c23a !important; }
.wx-火 { color: #f56c6c !important; }
.wx-土 { color: #b8863e !important; }
.wx-金 { color: #d4af37 !important; }
.wx-水 { color: #409eff !important; }

.cell-star {
  font-family: var(--font-chinese);
  font-size: 12px;
  font-weight: 500;
}

.cell-door {
  font-family: var(--font-chinese);
  font-size: 13px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 4px;
}

.cell-spirit {
  font-family: var(--font-chinese);
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.auspice-good {
  color: #67c23a;
}

.auspice-bad {
  color: #f56c6c;
}

.auspice-neutral {
  color: var(--text-secondary);
}

.center .auspice-good,
.center .auspice-bad,
.center .auspice-neutral {
  opacity: 0.6;
}

.direction-analysis {
  font-family: var(--font-chinese);
}

.dir-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.dir-item {
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-gold);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dir-item.good {
  border-color: #67c23a;
  background: rgba(103, 194, 58, 0.08);
}

.dir-item.bad {
  border-color: #f56c6c;
  background: rgba(245, 108, 108, 0.08);
}

.dir-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.dir-door {
  font-size: 13px;
  font-weight: 600;
}

.dir-door.good { color: #67c23a; }
.dir-door.bad { color: #f56c6c; }

.dir-star {
  font-size: 12px;
  color: var(--text-secondary);
}

.dir-summary {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  line-height: 2;
}

.dir-summary p {
  margin: 4px 0;
  font-size: 14px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 2px 4px;
}

.tag-good {
  background: rgba(103, 194, 58, 0.15);
  color: #67c23a;
}

.tag-bad {
  background: rgba(245, 108, 108, 0.15);
  color: #f56c6c;
}

@media (max-width: 640px) {
  .jiugong-cell {
    padding: 8px 4px;
    min-height: 90px;
  }
  .cell-stems {
    font-size: 14px;
  }
  .dir-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
