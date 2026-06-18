<template>
  <div class="home">
    <div class="hero">
      <div class="hero-bg-text">易</div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line">紫微智算</span>
          <span class="title-sub">AI 驱动的传统命理分析</span>
        </h1>
        <p class="hero-desc">融合千年易学智慧与前沿人工智能，为您呈现独特的命理解读</p>
      </div>
    </div>

    <div class="form-section">
      <div class="form-card">
        <div class="form-card-header">
          <span class="form-icon">📜</span>
          <span>输入出生信息</span>
        </div>

        <el-form :model="form" label-position="top" class="bazi-form">
          <el-form-item label="历法选择" class="compact-label">
            <el-radio-group v-model="form.calendarType" size="large">
              <el-radio value="solar">公历（阳历）</el-radio>
              <el-radio value="lunar">农历（阴历）</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="form.calendarType === 'solar'" class="date-hint">
            📅 直接填写 <strong>公历（阳历）</strong>出生日期
          </div>
          <div v-else class="date-hint lunar-hint">
            🌙 填写 <strong>农历（阴历）</strong>日期，系统自动转换为阳历排盘
          </div>
          <div class="form-row">
            <el-form-item label="出生年" class="form-item compact">
              <el-select v-model="form.year" placeholder="年" size="large">
                <el-option v-for="y in years" :key="y" :label="y + '年'" :value="y" />
              </el-select>
            </el-form-item>
            <el-form-item label="出生月" class="form-item compact">
              <el-select v-model="form.month" placeholder="月" size="large">
                <el-option v-for="m in 12" :key="m" :label="m + '月'" :value="m" />
              </el-select>
            </el-form-item>
            <el-form-item label="出生日" class="form-item compact">
              <el-select v-model="form.day" placeholder="日" size="large">
                <el-option v-for="d in maxDays" :key="d" :label="d + '日'" :value="d" />
              </el-select>
            </el-form-item>
          </div>

          <div v-if="form.calendarType === 'lunar' && convertedDate" class="converted-hint">
            ↪ 转换为阳历：<strong>{{ convertedDate.year }}年{{ convertedDate.month }}月{{ convertedDate.day }}日</strong>
          </div>

          <el-form-item label="出生时辰">
            <div class="shichen-grid">
              <button v-for="(sc, i) in shiChenList" :key="i"
                class="shichen-btn"
                :class="{ active: form.hourIndex === i }"
                @click="form.hourIndex = i">
                <span class="sc-name">{{ sc.name }}</span>
                <span class="sc-time">{{ sc.time }}</span>
              </button>
            </div>
          </el-form-item>

          <div class="form-row">
            <el-form-item label="性别" class="form-item compact">
              <el-radio-group v-model="form.gender" size="large">
                <el-radio value="男" label="男">男</el-radio>
                <el-radio value="女" label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生地点 (可选)" class="form-item compact flex-2">
              <el-input v-model="form.location" placeholder="省份/城市" size="large" clearable />
            </el-form-item>
          </div>

          <el-form-item>
            <el-button type="primary" size="large" class="submit-btn"
              :disabled="!canSubmit" @click="handleSubmit">
              <el-icon><Lightning /></el-icon>
              开始命理分析
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="features">
      <div class="feature-item" v-for="f in features" :key="f.title">
        <div class="feature-icon">{{ f.icon }}</div>
        <div class="feature-title">{{ f.title }}</div>
        <div class="feature-desc">{{ f.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { calculateBazi } from '@/data/bazi.js'
import solarLunar from 'solarlunar'

const router = useRouter()
const currentYear = new Date().getFullYear()

const form = ref({
  calendarType: 'solar',
  year: 1994,
  month: 3,
  day: 2,
  hourIndex: 11,
  gender: '男',
  location: '河南省驻马店市',
})

const years = computed(() => {
  const arr = []
  for (let y = 1930; y <= currentYear; y++) arr.push(y)
  return arr
})

const maxDays = computed(() => {
  if (form.value.calendarType === 'solar') {
    if (!form.value.year || !form.value.month) return 31
    return new Date(form.value.year, form.value.month, 0).getDate()
  }
  return 30
})

const convertedDate = computed(() => {
  if (form.value.calendarType !== 'lunar' || !form.value.year || !form.value.month || !form.value.day) return null
  try {
    const result = solarLunar.lunar2solar(form.value.year, form.value.month, form.value.day, false)
    return result ? { year: result.cYear, month: result.cMonth, day: result.cDay } : null
  } catch {
    return null
  }
})

const shiChenList = [
  { name: '子时', time: '23:00–01:00' },
  { name: '丑时', time: '01:00–03:00' },
  { name: '寅时', time: '03:00–05:00' },
  { name: '卯时', time: '05:00–07:00' },
  { name: '辰时', time: '07:00–09:00' },
  { name: '巳时', time: '09:00–11:00' },
  { name: '午时', time: '11:00–13:00' },
  { name: '未时', time: '13:00–15:00' },
  { name: '申时', time: '15:00–17:00' },
  { name: '酉时', time: '17:00–19:00' },
  { name: '戌时', time: '19:00–21:00' },
  { name: '亥时', time: '21:00–23:00' },
]

const canSubmit = computed(() =>
  form.value.year && form.value.month && form.value.day &&
  form.value.hourIndex !== null && form.value.gender
)

const features = [
  { icon: '🏛️', title: '八字排盘', desc: '精确计算四柱八字、十神、纳音、藏干' },
  { icon: '⚖️', title: '五行分析', desc: '五行旺衰量化，生克制化一目了然' },
  { icon: '🔄', title: '大运流年', desc: '大运走势 + 流年吉凶提示' },
  { icon: '🧭', title: '综合建议', desc: '方位、改名、事业选择等实用建议' },
]

function handleSubmit() {
  const hourMap = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
  const date = form.value.calendarType === 'lunar' && convertedDate.value
    ? convertedDate.value
    : { year: form.value.year, month: form.value.month, day: form.value.day }
  const result = calculateBazi({
    year: date.year,
    month: date.month,
    day: date.day,
    hour: hourMap[form.value.hourIndex],
    gender: form.value.gender,
    location: form.value.location,
  })
  sessionStorage.setItem('baziResult', JSON.stringify(result))
  router.push('/reading')
}
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
}

.hero {
  position: relative;
  text-align: center;
  padding: 80px 24px 60px;
  overflow: hidden;
}

.hero-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-chinese);
  font-size: 320px;
  font-weight: 900;
  color: rgba(196, 154, 74, 0.04);
  pointer-events: none;
  user-select: none;
  line-height: 1;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.title-line {
  font-family: var(--font-chinese);
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 6px;
}

.title-sub {
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 300;
  letter-spacing: 3px;
}

.hero-desc {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.8;
}

.form-section {
  display: flex;
  justify-content: center;
  padding: 0 24px 48px;
}

.form-card {
  width: 100%;
  max-width: 680px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  padding: 32px 36px;
  box-shadow: var(--shadow-card);
}

.form-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-gold);
  font-family: var(--font-chinese);
  font-size: 18px;
  font-weight: 700;
  color: var(--gold);
}

.form-icon {
  font-size: 22px;
}

.date-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: -8px 0 18px;
  padding: 8px 12px;
  background: rgba(196, 154, 74, 0.05);
  border-radius: 6px;
  border: 1px solid var(--border-gold);
  line-height: 1.5;
}

.date-hint strong {
  color: var(--gold);
}

.date-hint.lunar-hint {
  border-color: rgba(106, 158, 138, 0.2);
  background: rgba(106, 158, 138, 0.04);
}

.date-hint.lunar-hint strong {
  color: var(--teal);
}

.converted-hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin: -8px 0 16px;
  padding: 10px 14px;
  background: rgba(106, 158, 138, 0.06);
  border-radius: 6px;
  border: 1px solid var(--border-teal);
  line-height: 1.5;
  text-align: center;
}

.converted-hint strong {
  color: var(--teal);
  font-size: 15px;
}

.compact-label {
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.form-item.compact {
  margin-bottom: 0;
}

.form-item.compact.flex-2 {
  grid-column: span 2;
}

.shichen-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.shichen-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 6px;
  background: rgba(196, 154, 74, 0.04);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s;
  color: var(--text-primary);
  font-family: var(--font-chinese);
}

.shichen-btn:hover {
  border-color: rgba(196, 154, 74, 0.4);
  background: rgba(196, 154, 74, 0.08);
}

.shichen-btn.active {
  border-color: var(--gold);
  background: var(--gold-dim);
  box-shadow: 0 0 20px rgba(196, 154, 74, 0.15);
}

.sc-name {
  font-size: 16px;
  font-weight: 700;
}

.sc-time {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-sans);
}

.shichen-btn.active .sc-time {
  color: var(--text-secondary);
}

.submit-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  background: var(--cast-bg);
  border: none;
  color: var(--cast-text);
  border-radius: 10px;
  margin-top: 8px;
}

.submit-btn:hover {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  box-shadow: 0 8px 32px rgba(196, 154, 74, 0.25);
}

.submit-btn.is-disabled {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
}

.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 0 48px 80px;
  max-width: 960px;
  margin: 0 auto;
}

.feature-item {
  text-align: center;
  padding: 24px 16px;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-title {
  font-family: var(--font-chinese);
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero { padding: 48px 16px 40px; }
  .hero-bg-text { font-size: 160px; }
  .title-line { font-size: 36px; }
  .form-card { padding: 24px 20px; }
  .form-row { grid-template-columns: 1fr; }
  .form-item.compact.flex-2 { grid-column: span 1; }
  .shichen-grid { grid-template-columns: repeat(4, 1fr); }
  .features {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 20px 60px;
    gap: 12px;
  }
}
</style>
