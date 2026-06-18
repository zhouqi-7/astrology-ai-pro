<template>
  <div class="reading" v-if="data">
    <div class="reading-header">
      <div class="header-badge">命理报告</div>
      <h1 class="header-title">{{ data.pillars[2].gan }}{{ data.pillars[2].zhi }} · {{ data.shengXiao }}年 · {{ data.hourDisplay }}</h1>
      <p class="header-meta">{{ data.birth.year }}年{{ data.birth.month }}月{{ data.birth.day }}日 · 性别 {{ data.birth.gender }} · {{ data.birth.location }}</p>
    </div>

    <div class="reading-body">
      <!-- 八字排盘 -->
      <SectionCard title="八字排盘" icon="🏛️">
        <BaziChart :pillars="data.pillars" :sheng-xiao="data.shengXiao"
          :hour-display="data.hourDisplay" :day-gan="data.pillars[2].gan" />
      </SectionCard>

      <!-- 五行分析 -->
      <SectionCard title="五行分析" icon="⚖️">
        <FiveElements :wu-xing="data.wuXing" />
      </SectionCard>

      <!-- 大运走势 -->
      <SectionCard title="大运走势" icon="🔄">
        <DaYunTimeline :da-yun="data.daYun" :current-da-yun="data.currentDaYun" />
        <div class="dayun-detail">
          <p><strong>起运年龄：</strong>约1岁4个月（1995年起运）</p>
          <p><strong>当前大运：</strong>{{ data.currentDaYun.gan }}{{ data.currentDaYun.zhi }}（{{ data.currentDaYun.ageStart }}–{{ data.currentDaYun.ageStart + 9 }}岁，{{ data.currentDaYun.yearStart }}–{{ data.currentDaYun.yearEnd }}），庚金正财透干，这十年是求财与事业发展的关键期。</p>
        </div>
      </SectionCard>

      <!-- 2026流年 -->
      <SectionCard title="2026 丙午流年" icon="🔥">
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
      </SectionCard>

      <!-- 方位建议 -->
      <SectionCard title="方位建议" icon="🧭">
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
      </SectionCard>

      <!-- 改名建议 -->
      <SectionCard title="改名建议" icon="✒️">
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
      </SectionCard>

      <!-- 感情分析 -->
      <SectionCard title="感情分析" icon="💝">
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
      </SectionCard>

      <!-- 择偶分析 -->
      <SectionCard title="择偶建议" icon="🤝">
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
      </SectionCard>
    </div>

    <div class="reading-footer">
      <p class="footer-note">本报告由 AI 基于传统命理学生成，仅供娱乐参考，不可作为决策依据。</p>
      <el-button size="large" @click="goBack">
        <el-icon><Back /></el-icon>
        重新输入
      </el-button>
    </div>
  </div>

  <div class="reading-empty" v-else>
    <p>请先输入出生信息</p>
    <el-button type="primary" size="large" @click="goBack">
      <el-icon><Back /></el-icon>
      返回首页
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SectionCard from '@/components/SectionCard.vue'
import BaziChart from '@/components/BaziChart.vue'
import FiveElements from '@/components/FiveElements.vue'
import DaYunTimeline from '@/components/DaYunTimeline.vue'

const router = useRouter()
const data = ref(null)

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
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.reading-header {
  text-align: center;
  padding: 48px 0 40px;
  position: relative;
}

.header-badge {
  display: inline-block;
  padding: 4px 18px;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--gold);
  border: 1px solid var(--gold-dim);
  border-radius: 20px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.header-title {
  font-family: var(--font-chinese);
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.header-meta {
  font-size: 14px;
  color: var(--text-secondary);
}

.reading-body {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.dayun-detail {
  margin-top: 24px;
  padding: 16px 20px;
  background: rgba(106, 158, 138, 0.04);
  border-radius: 8px;
  border: 1px solid var(--border-teal);
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-primary);
}

.dayun-detail strong {
  color: var(--teal);
}

/* 流年分析 */
.liunian-gz {
  text-align: center;
  margin-bottom: 24px;
}

.gz-big {
  font-family: var(--font-chinese);
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent-red), #9a6a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 8px;
}

.gz-desc {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.analysis-item {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--border-gold);
  background: rgba(255, 255, 255, 0.02);
  font-size: 14px;
  line-height: 1.8;
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
  font-size: 15px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 8px;
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
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 20px 0 14px;
  padding-left: 12px;
  border-left: 3px solid var(--gold);
}

/* 方位 */
.direction-map {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.direction-item {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid var(--border-gold);
  background: rgba(255, 255, 255, 0.02);
}

.direction-item.best { border-color: rgba(196, 154, 74, 0.3); background: rgba(196, 154, 74, 0.06); }
.direction-item.avoid { border-color: rgba(196, 102, 90, 0.2); background: rgba(196, 102, 90, 0.04); }

.dir-icon {
  font-size: 24px;
  flex-shrink: 0;
  width: 36px;
  text-align: center;
  padding-top: 2px;
}

.dir-body {
  flex: 1;
}

.dir-label {
  font-family: var(--font-chinese);
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}

.dir-tag {
  display: inline-block;
  font-size: 11px;
  padding: 1px 10px;
  border-radius: 10px;
  background: var(--gold-dim);
  color: var(--gold);
  margin-bottom: 6px;
}

.direction-item.avoid .dir-tag {
  background: rgba(196, 102, 90, 0.1);
  color: var(--accent-red);
}

.dir-body p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.shenzhen-section {
  margin-top: 24px;
  padding: 20px;
  background: rgba(106, 158, 138, 0.04);
  border-radius: 10px;
  border: 1px solid var(--border-teal);
}

.shenzhen-section p {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 12px;
}

.advice-list {
  list-style: none;
  padding: 0;
}

.advice-list li {
  padding: 8px 0 8px 20px;
  position: relative;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.advice-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--teal);
}

/* 改名 */
.intro-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.name-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.name-grid.single {
  grid-template-columns: repeat(3, 1fr);
}

.name-card {
  padding: 20px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-gold);
  background: rgba(255, 255, 255, 0.02);
  text-align: center;
  transition: transform 0.3s;
}

.name-card:hover { transform: translateY(-4px); }
.name-card.best { border-color: var(--gold); background: var(--gold-dim); }

.name-priority {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.name-card.best .name-priority { color: var(--gold); }

.name-value {
  font-family: var(--font-chinese);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  letter-spacing: 2px;
}

.name-card.best .name-value {
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.name-wuxing {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.name-card p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 感情 */
.analysis-section {
  margin-bottom: 20px;
}

.analysis-section p {
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-primary);
}

.analysis-section.conclusion {
  padding: 16px 20px;
  background: var(--gold-dim);
  border-radius: 8px;
  border: 1px solid var(--border-gold);
}

.year-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
}

.year-row {
  display: grid;
  grid-template-columns: 100px 120px 1fr;
  gap: 12px;
  padding: 12px 16px;
  font-size: 13px;
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
  font-size: 12px;
  color: var(--text-secondary);
}

.year-desc {
  color: var(--text-secondary);
}

/* 择偶 */
.inner-list {
  list-style: none;
  padding: 0;
}

.inner-list li {
  padding: 4px 0 4px 16px;
  position: relative;
  font-size: 13px;
  line-height: 1.7;
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
  gap: 6px;
}

.zodiac-item {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.02);
}

.zodiac-item.good { color: var(--accent-green); }
.zodiac-item.avoid { color: var(--accent-red); }

.zodiac-icon { margin-right: 4px; }

.reading-footer {
  text-align: center;
  padding-top: 48px;
}

.footer-note {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 20px;
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

@media (max-width: 768px) {
  .header-title { font-size: 24px; }
  .analysis-grid { grid-template-columns: 1fr; }
  .name-grid { grid-template-columns: 1fr 1fr; }
  .name-grid.single { grid-template-columns: 1fr 1fr; }
  .year-row { grid-template-columns: 1fr; gap: 4px; }
  .zodiac-grid { grid-template-columns: 1fr; }
  .direction-item { flex-direction: column; gap: 8px; }
}
</style>
