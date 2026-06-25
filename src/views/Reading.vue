<template>
  <div class="reading" v-if="data">
    <div class="reading-topbar">
      <el-button size="small" class="back-btn" @click="goBack">
        <el-icon><Back /></el-icon>
        重新输入
      </el-button>
      <div class="topbar-info">
        <span class="topbar-title">{{ data.pillars[2].gan }}{{ data.pillars[2].zhi }} · {{ data.shengXiao }}年 · {{ data.hourDisplay }}</span>
        <span class="topbar-meta">{{ data.birth.year }}年{{ data.birth.month }}月{{ data.birth.day }}日 · {{ data.birth.gender }} · {{ data.birth.location }}</span>
      </div>
    </div>

    <div class="reading-body">
      <div class="panel-grid">
        <div class="panel-chart">
          <div class="panel-header">八字排盘</div>
          <BaziChart :pillars="data.pillars" :sheng-xiao="data.shengXiao"
            :hour-display="data.hourDisplay" :day-gan="data.pillars[2].gan" />
        </div>
        <div class="panel-right">
          <div class="panel-wuxing">
            <div class="panel-header">五行分析</div>
            <FiveElements :wu-xing="data.wuXing" />
          </div>
          <div class="panel-dayun">
            <div class="panel-header">大运走势</div>
            <div class="dayun-compact">
              <div class="dayun-current-badge">{{ data.currentDaYun.gan }}{{ data.currentDaYun.zhi }}</div>
              <div class="dayun-current-info">{{ data.currentDaYun.ageStart }}–{{ data.currentDaYun.ageStart + 9 }}岁 · {{ data.currentDaYun.yearStart }}–{{ data.currentDaYun.yearEnd }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="analysis-tabs">
        <el-tabs v-model="activeTab" class="reading-tabs">
          <el-tab-pane label="流年分析" name="liunian">
            <div class="liunian-gz">
              <span class="gz-big">丙午</span>
              <span class="gz-desc">天干丙火，地支午火，干支皆火</span>
            </div>
            <div class="analysis-grid">
              <div class="analysis-item caution">
                <div class="ai-label">⚠️ 变动之年</div>
                <p>丙午流年与日柱丁亥<span class="highlight">天克地冲</span>（丙克亥中壬水 / 午亥暗合又相冲），易有工作变动、搬迁或感情波动。</p>
              </div>
              <div class="analysis-item positive">
                <div class="ai-label">💰 伤官配印</div>
                <p>利于技能发挥、学习深造和自我提升。适合充电、考证、拓展人脉。</p>
              </div>
              <div class="analysis-item caution">
                <div class="ai-label">🏥 健康注意</div>
                <p>火旺克金水，注意心血管、眼睛、血压方面的问题，避免熬夜和过度操劳。</p>
              </div>
              <div class="analysis-item advice">
                <div class="ai-label">💡 建议</div>
                <p>今年适合主动社交、扩大圈子，为后面正缘铺路，但不宜急于做重大决定或闪婚。</p>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="方位建议" name="fangwei">
            <div class="direction-map">
              <div class="direction-item best">
                <div class="dir-icon">🥇</div>
                <div class="dir-body">
                  <div class="dir-label">西北 / 北方</div>
                  <div class="dir-tag">金水 · 最利</div>
                  <p>金生水，水火既济，是你的用神方位。偏北方沿海城市如青岛、大连、天津最佳。</p>
                </div>
              </div>
              <div class="direction-item good">
                <div class="dir-icon">🥈</div>
                <div class="dir-body">
                  <div class="dir-label">西方</div>
                  <div class="dir-tag">金 · 次选</div>
                  <p>利财，适合从事金融、科技硬件等行业的求财发展。</p>
                </div>
              </div>
              <div class="direction-item neutral">
                <div class="dir-icon">🥉</div>
                <div class="dir-body">
                  <div class="dir-label">内陆中原</div>
                  <div class="dir-tag">土 · 中性</div>
                  <p>土泄火气，略显平淡但无害，适合稳定性行业。</p>
                </div>
              </div>
              <div class="direction-item avoid">
                <div class="dir-icon">✖</div>
                <div class="dir-body">
                  <div class="dir-label">东南 / 南方</div>
                  <div class="dir-tag">木火 · 忌</div>
                  <p>木助火势，火上浇油，易耗神失眠、开销增大。</p>
                </div>
              </div>
            </div>
            <div class="shenzhen-section" v-if="hasShenzhen">
              <h3 class="sub-title">深圳发展分析</h3>
              <p>深圳位于南方（火），但属沿海（水），水火兼具。对你而言<span class="highlight">利大于弊</span>：沿海多水为用神，火旺之地也利于发挥才华。建议：</p>
              <ul class="advice-list">
                <li><strong>行业：</strong>优先水属性（贸易、物流、跨境电商、金融）或金属性（科技硬件、IT），避开纯粹火土行业（餐饮、娱乐）</li>
                <li><strong>居住：</strong>偏北/西区域（宝安西部、南山靠海、福田偏北），避免罗湖老城区</li>
                <li><strong>时机：</strong>当前庚午大运，庚金正财透出，深圳五行属金的行业正对应用神，求财有利</li>
              </ul>
            </div>
          </el-tab-pane>

          <el-tab-pane label="改名建议" name="gaiming">
            <p class="intro-text">姓氏"远"五行属土，八字喜金水。以下按推荐度排列：</p>
            <div class="name-section">
              <h3 class="sub-title">双名推荐</h3>
              <div class="name-grid">
                <div class="name-card best">
                  <div class="name-priority">TOP 1</div>
                  <div class="name-value">远润泽</div>
                  <div class="name-wuxing">土 · 水 · 水</div>
                  <p>润泽万物，水火既济，大吉之选</p>
                </div>
                <div class="name-card">
                  <div class="name-priority">TOP 2</div>
                  <div class="name-value">远铭浩</div>
                  <div class="name-wuxing">土 · 金 · 水</div>
                  <p>铭记浩大胸襟，金水相生</p>
                </div>
                <div class="name-card">
                  <div class="name-priority">TOP 3</div>
                  <div class="name-value">远清源</div>
                  <div class="name-wuxing">土 · 水 · 水</div>
                  <p>清正本源，正财得力</p>
                </div>
                <div class="name-card">
                  <div class="name-priority">TOP 4</div>
                  <div class="name-value">远钧泽</div>
                  <div class="name-wuxing">土 · 金 · 水</div>
                  <p>钧衡天下，泽被四方</p>
                </div>
              </div>
              <h3 class="sub-title">单名推荐</h3>
              <div class="name-grid single">
                <div class="name-card best">
                  <div class="name-priority">TOP 1</div>
                  <div class="name-value">远涵</div>
                  <div class="name-wuxing">土 · 水</div>
                  <p>内涵沉稳，补水制火</p>
                </div>
                <div class="name-card">
                  <div class="name-priority">TOP 2</div>
                  <div class="name-value">远澜</div>
                  <div class="name-wuxing">土 · 水</div>
                  <p>波澜壮阔，有气势</p>
                </div>
                <div class="name-card">
                  <div class="name-priority">TOP 3</div>
                  <div class="name-value">远铮</div>
                  <div class="name-wuxing">土 · 金</div>
                  <p>铮铮铁骨，补金助财</p>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="感情分析" name="ganqing">
            <div class="analysis-section">
              <h3 class="sub-title">命局解读</h3>
              <p>日柱 <strong class="highlight">丁亥</strong>，亥为夫妻宫，内藏壬水正官，时柱又见亥水七杀，<strong>官杀混杂</strong>，感情易反复。妻星（正财庚金）原局不显，仅暗藏年支戌中辛金偏财，代表异性缘较晚或易有暧昧。</p>
            </div>
            <div class="analysis-section">
              <h3 class="sub-title">大运机遇</h3>
              <p>当前 <strong class="highlight">庚午大运（2025–2034）</strong>，庚金正财妻星透出，正缘已入运，这十年是婚恋关键期。</p>
            </div>
            <div class="analysis-section">
              <h3 class="sub-title">流年机遇表</h3>
              <div class="year-table">
                <div class="year-row">
                  <span class="year-label">2026 丙午</span>
                  <span class="year-signal">🔥 冲夫妻宫</span>
                  <span class="year-desc">大运+流年双午冲动夫妻宫，易遇心仪对象，但火旺性急宜稳</span>
                </div>
                <div class="year-row highlight">
                  <span class="year-label">2027 丁未</span>
                  <span class="year-signal">✅ 合夫妻宫</span>
                  <span class="year-desc">亥未半合木，关系趋稳，适合确立关系</span>
                </div>
                <div class="year-row">
                  <span class="year-label">2029 己酉</span>
                  <span class="year-signal">🌸 桃花年</span>
                  <span class="year-desc">酉金桃花且为偏财，感情机会很旺</span>
                </div>
                <div class="year-row best">
                  <span class="year-label">2030 庚戌</span>
                  <span class="year-signal">💍 正缘年</span>
                  <span class="year-desc">庚金正财妻星透干，最明显的正缘信号</span>
                </div>
              </div>
            </div>
            <div class="analysis-section conclusion">
              <p><strong>结论：</strong><span class="highlight">2027年（丁未）</span>和<span class="highlight">2030年（庚戌）</span>是感情落地的最好窗口。后者尤为关键，正财妻星透天干，宜把握。</p>
            </div>
          </el-tab-pane>

          <el-tab-pane label="择偶建议" name="zeou">
            <div class="analysis-grid">
              <div class="analysis-item">
                <div class="ai-label">五行匹配</div>
                <p><strong>最佳：</strong>壬水/癸水日主（正官/七杀），水克火制衡，亥水夫妻宫同气</p>
                <p><strong>次佳：</strong>庚金/辛金日主（正偏财），金生水间接助用神，且财生官旺婚姻</p>
                <p><strong>避：</strong>丙火/丁火（两火相争易吵）、甲木/乙木（木生火旺上加旺）</p>
              </div>
              <div class="analysis-item">
                <div class="ai-label">性格特质</div>
                <ul class="inner-list">
                  <li>沉稳理性（金水性），能中和你的感性冲动</li>
                  <li>有主见但不强势</li>
                  <li>善理财，能帮你守财</li>
                  <li>北方/沿海人性格，爽朗大方不黏腻</li>
                </ul>
              </div>
              <div class="analysis-item">
                <div class="ai-label">生肖推荐</div>
                <div class="zodiac-grid">
                  <div class="zodiac-item good"><span class="zodiac-icon">✅</span>鼠（子）· 比旺用神</div>
                  <div class="zodiac-item good"><span class="zodiac-icon">✅</span>猴（申）· 金生水</div>
                  <div class="zodiac-item good"><span class="zodiac-icon">✅</span>鸡（酉）· 偏财桃花</div>
                  <div class="zodiac-item good"><span class="zodiac-icon">✅</span>牛（丑）· 土生金</div>
                  <div class="zodiac-item avoid"><span class="zodiac-icon">⚠️</span>蛇（巳）· 巳亥冲</div>
                  <div class="zodiac-item avoid"><span class="zodiac-icon">⚠️</span>猪（亥）· 日支伏吟</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="reading-footer">
      <p class="footer-note">本报告由 AI 基于传统命理学生成，仅供娱乐参考，不可作为决策依据。</p>
    </div>
  </div>

  <div class="reading-empty" v-else>
    <p>请先输入出生信息</p>
    <el-button type="primary" size="large" @click="goBack">
      <el-icon><Back /></el-icon>
      返回首页
    </el-button>
    <TheoryInfo title="八字命理" :sections="baziTheory" :sources="baziSources" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaziChart from '@/components/BaziChart.vue'
import FiveElements from '@/components/FiveElements.vue'
import TheoryInfo from '@/components/TheoryInfo.vue'

const baziTheory = [
  { heading: '历史渊源', lines: ['八字命理起源于汉代，成熟于宋代徐子平《渊海子平》，后世《三命通会》《滴天髓》《穷通宝鉴》等经典不断完善。'] },
  { heading: '四柱推算法则', lines: ['年柱以立春为界（solarlunar库内置此规则）。', '月柱以节气为界，用五虎遁定天干（甲己之年丙作首，乙庚之岁戊为头...）。', '日柱以1900年1月1日庚子日为基准推算。', '时柱以日干定子时天干，用五鼠遁（甲己还加甲，乙庚丙作初...）。'] },
  { heading: '十神体系', lines: ['以日干为"我"，与其他天干的关系定义十神（比肩、劫财、食神、伤官、偏财、正财、偏官、正官、偏印、正印），反映社会人际关系与五行生克。'] },
  { heading: '五行旺衰', lines: ['根据四柱天干地支及藏干的五行分布评分，计算木火土金水的权重，判断命局平衡与喜用神。'] },
  { heading: '大运与流年', lines: ['十年一大运，根据年干阴阳与性别定顺逆排布。流年即当年干支与命局的动态互动，用于推算每年的吉凶应期。'] },
]
const baziSources = ['徐子平《渊海子平》', '万民英《三命通会》', '《滴天髓》（相传刘基注）', '沈孝瞻《子平真诠》', '余春台《穷通宝鉴》']

const router = useRouter()
const data = ref(null)
const activeTab = ref('liunian')

const hasShenzhen = computed(() =>
  data.value?.birth?.location?.includes('深圳') || data.value?.birth?.location?.includes('广东')
)

onMounted(() => {
  const raw = sessionStorage.getItem('baziResult')
  if (raw) {
    data.value = JSON.parse(raw)
    window.scrollTo(0, 0)
  }
})

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.reading {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

.reading-topbar {
  position: sticky;
  top: 64px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-gold);
  margin: 0 -24px 16px;
}

.back-btn {
  flex-shrink: 0;
}

.topbar-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.topbar-title {
  font-family: var(--font-chinese);
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-meta {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reading-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 12px;
  align-items: start;
}

.panel-header {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-gold);
}

.panel-chart,
.panel-wuxing,
.panel-dayun {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  padding: 16px 20px;
}

.panel-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-dayun .dayun-compact {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dayun-current-badge {
  font-family: var(--font-chinese);
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold), var(--teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.dayun-current-info {
  font-size: 12px;
  color: var(--text-secondary);
}

/* make chart compact */
.panel-chart :deep(.chart-grid) {
  grid-template-columns: 50px repeat(4, 1fr);
}
.panel-chart :deep(.cell) {
  padding: 6px 4px;
  min-height: 32px;
  font-size: 12px;
}
.panel-chart :deep(.cell.gan),
.panel-chart :deep(.cell.zhi) {
  font-size: 22px;
  padding: 8px 4px;
}
.panel-chart :deep(.chart-footer) {
  margin-top: 10px;
  padding: 10px 16px;
  gap: 16px;
}
.panel-chart :deep(.chart-footer .info-value) {
  font-size: 14px;
}

/* make five elements compact */
.panel-wuxing :deep(.elements-grid) {
  gap: 12px;
  margin-bottom: 0;
}
.panel-wuxing :deep(.element-ring) {
  width: 52px;
  height: 52px;
}
.panel-wuxing :deep(.element-symbol) {
  font-size: 14px;
}
.panel-wuxing :deep(.element-value) {
  font-size: 10px;
}
.panel-wuxing :deep(.element-name) {
  font-size: 12px;
}
.panel-wuxing :deep(.elements-desc) {
  display: none;
}
.panel-wuxing :deep(.wu-xing-summary) {
  margin-top: 10px;
  padding: 8px 12px;
}
.panel-wuxing :deep(.summary-text) {
  font-size: 13px;
}

/* tabs */
.analysis-tabs {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  padding: 0 20px 16px;
}

.reading-tabs :deep(.el-tabs__header) {
  margin: 0 0 12px;
  border-bottom: 1px solid var(--border-gold);
}

.reading-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.reading-tabs :deep(.el-tabs__item) {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
}

.reading-tabs :deep(.el-tabs__item.is-active) {
  color: var(--gold);
}

.reading-tabs :deep(.el-tabs__active-bar) {
  background: var(--gold);
  height: 2px;
}

/* 流年分析 */
.liunian-gz {
  text-align: center;
  margin-bottom: 16px;
}

.gz-big {
  font-family: var(--font-chinese);
  font-size: 36px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent-red), #9a6a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 6px;
}

.gz-desc {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.analysis-item {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-gold);
  background: rgba(255, 255, 255, 0.02);
  font-size: 13px;
  line-height: 1.7;
}

.analysis-item.caution {
  border-color: rgba(196, 102, 90, 0.2);
  background: rgba(196, 102, 90, 0.04);
}

.analysis-item.positive {
  border-color: rgba(122, 158, 106, 0.2);
  background: rgba(122, 158, 106, 0.04);
}

.analysis-item.advice {
  border-color: rgba(106, 142, 174, 0.2);
  background: rgba(106, 142, 174, 0.04);
}

.ai-label {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 6px;
}

.analysis-item.caution .ai-label { color: var(--accent-red); }
.analysis-item.positive .ai-label { color: var(--accent-green); }
.analysis-item.advice .ai-label { color: var(--accent-blue); }

.highlight {
  color: var(--gold);
  font-weight: 700;
}

.sub-title {
  font-family: var(--font-chinese);
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 14px 0 10px;
  padding-left: 10px;
  border-left: 3px solid var(--gold);
}

/* 方位 */
.direction-map {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.direction-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-gold);
  background: rgba(255, 255, 255, 0.02);
}

.direction-item.best { border-color: rgba(196, 154, 74, 0.3); background: rgba(196, 154, 74, 0.06); }
.direction-item.avoid { border-color: rgba(196, 102, 90, 0.2); background: rgba(196, 102, 90, 0.04); }

.dir-icon { font-size: 20px; flex-shrink: 0; width: 28px; text-align: center; }

.dir-body { flex: 1; }

.dir-label {
  font-family: var(--font-chinese);
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 2px;
}

.dir-tag {
  display: inline-block;
  font-size: 10px;
  padding: 1px 8px;
  border-radius: 8px;
  background: var(--gold-dim);
  color: var(--gold);
  margin-bottom: 4px;
}

.direction-item.avoid .dir-tag {
  background: rgba(196, 102, 90, 0.1);
  color: var(--accent-red);
}

.dir-body p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.shenzhen-section {
  margin-top: 16px;
  padding: 14px 16px;
  background: rgba(106, 158, 138, 0.04);
  border-radius: 8px;
  border: 1px solid var(--border-teal);
}

.shenzhen-section p {
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 8px;
}

.advice-list {
  list-style: none;
  padding: 0;
}

.advice-list li {
  padding: 6px 0 6px 16px;
  position: relative;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.advice-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--teal);
}

/* 改名 */
.intro-text {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.name-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.name-grid.single {
  grid-template-columns: repeat(3, 1fr);
}

.name-card {
  padding: 14px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-gold);
  background: rgba(255, 255, 255, 0.02);
  text-align: center;
  transition: transform 0.3s;
}

.name-card:hover { transform: translateY(-2px); }
.name-card.best { border-color: var(--gold); background: var(--gold-dim); }

.name-priority {
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.name-card.best .name-priority { color: var(--gold); }

.name-value {
  font-family: var(--font-chinese);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.name-card.best .name-value {
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.name-wuxing {
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.name-card p {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 感情 */
.analysis-section {
  margin-bottom: 14px;
}

.analysis-section p {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-primary);
}

.analysis-section.conclusion {
  padding: 12px 16px;
  background: var(--gold-dim);
  border-radius: 8px;
  border: 1px solid var(--border-gold);
}

.year-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 8px;
}

.year-row {
  display: grid;
  grid-template-columns: 90px 100px 1fr;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12px;
  align-items: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
}

.year-row.highlight {
  background: rgba(122, 158, 106, 0.06);
  border: 1px solid rgba(122, 158, 106, 0.15);
}

.year-row.best {
  background: var(--gold-dim);
  border: 1px solid var(--border-gold);
}

.year-label {
  font-family: var(--font-chinese);
  font-weight: 700;
  color: var(--text-primary);
}

.year-row.best .year-label {
  color: var(--gold);
}

.year-signal {
  font-size: 11px;
  color: var(--text-secondary);
}

.year-desc {
  color: var(--text-secondary);
  font-size: 12px;
}

/* 择偶 */
.inner-list {
  list-style: none;
  padding: 0;
}

.inner-list li {
  padding: 3px 0 3px 14px;
  position: relative;
  font-size: 12px;
  line-height: 1.6;
}

.inner-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--gold);
}

.zodiac-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.zodiac-item {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.zodiac-item.good { color: var(--accent-green); }
.zodiac-item.avoid { color: var(--accent-red); }

.zodiac-icon { margin-right: 4px; }

.reading-footer {
  text-align: center;
  padding-top: 24px;
}

.footer-note {
  font-size: 11px;
  color: var(--text-muted);
}

.reading-empty {
  text-align: center;
  padding: 120px 24px;
}

.reading-empty p {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

@media (max-width: 900px) {
  .panel-grid {
    grid-template-columns: 1fr;
  }
  .panel-right {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .reading-topbar {
    flex-wrap: wrap;
    padding: 8px 12px;
  }
  .topbar-title { font-size: 14px; }
  .panel-right { grid-template-columns: 1fr; }
  .analysis-grid { grid-template-columns: 1fr; }
  .name-grid { grid-template-columns: 1fr 1fr; }
  .name-grid.single { grid-template-columns: 1fr 1fr; }
  .year-row { grid-template-columns: 1fr; gap: 2px; padding: 6px 10px; }
  .zodiac-grid { grid-template-columns: 1fr; }
  .direction-item { flex-direction: column; gap: 6px; }
  .reading-tabs :deep(.el-tabs__item) {
    padding: 0 10px;
    font-size: 13px;
  }
}
</style>
