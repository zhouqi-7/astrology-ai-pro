<template>
  <div class="meihua">
    <div class="page-hero">
      <div class="hero-bg">䷀</div>
      <h1 class="hero-title">梅花易数</h1>
      <p class="hero-desc">以数起卦，以象断吉凶 · 邵雍心法 · AI 解卦</p>
    </div>

    <div class="form-section">
      <div class="form-card">
        <div class="form-header">
          <span class="form-icon">🔢</span>
          <span>随心取数起卦</span>
        </div>
        <p class="form-hint">任意输入三个数字，系统将根据梅花易数法则为你起卦解读。</p>
        <el-form class="num-form" @submit.prevent="castDivination">
          <div class="num-inputs">
            <el-form-item label="上卦数">
              <el-input-number v-model="num1" :min="1" :max="999" size="large" controls-position="right" />
            </el-form-item>
            <el-form-item label="下卦数">
              <el-input-number v-model="num2" :min="1" :max="999" size="large" controls-position="right" />
            </el-form-item>
            <el-form-item label="动爻数">
              <el-input-number v-model="num3" :min="1" :max="999" size="large" controls-position="right" />
            </el-form-item>
          </div>
          <el-button type="primary" size="large" class="cast-btn" @click="castDivination">
            <el-icon><Lightning /></el-icon>
            起卦
          </el-button>
        </el-form>

        <div class="quick-presets" v-if="!result">
          <span class="preset-label">快速体验：</span>
          <el-button size="small" v-for="(p, i) in presets" :key="i" @click="applyPreset(p)">
            {{ p.label }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 卦象结果 -->
    <div class="result-section" v-if="result">
      <SectionCard :title="'【' + result.hexagram.name + '】' + result.hexagram.title" icon="䷀">
        <div class="hexagram-display">
          <div class="trigram-group">
            <div class="trigram-label">本卦 · {{ result.hexagram.name }}</div>
            <div class="hexagram-lines">
              <div v-for="(line, i) in result.hexagram.lines" :key="i"
                class="hex-line"
                :class="{ moving: i === result.movingYao, yang: line === 1, yin: line === 0 }"
                :style="{ '--i': i }"
                @click="toggleYao(i)">
                <span class="line-num">{{ 6 - i }}</span>
                <span class="line-bar">
                  <span v-if="line === 1" class="bar yang-bar">
                    <span class="bar-seg" /><span class="bar-seg" />
                  </span>
                  <span v-else class="bar yin-bar">
                    <span class="bar-seg" /><span class="bar-gap" /><span class="bar-seg" />
                  </span>
                </span>
                <span v-if="i === result.movingYao" class="moving-badge">动</span>
              </div>
            </div>
          </div>
          <div class="trigram-meta">
            <div class="trigram-info">
              <span class="info-key">上卦：</span>
              <span class="info-val">{{ result.upperTrigram.symbol }} {{ result.upperTrigram.name }} ({{ result.upperTrigram.nature }})</span>
            </div>
            <div class="trigram-info">
              <span class="info-key">下卦：</span>
              <span class="info-val">{{ result.lowerTrigram.symbol }} {{ result.lowerTrigram.name }} ({{ result.lowerTrigram.nature }})</span>
            </div>
            <div class="trigram-info">
              <span class="info-key">动爻：</span>
              <span class="info-val moving">第{{ 6 - result.movingYao }}爻动</span>
            </div>
          </div>
        </div>

        <div class="yao-detail" v-if="showYaoDetail">
          <p>{{ result.yaoText }}</p>
        </div>
      </SectionCard>

      <SectionCard title="卦象解读" icon="📜">
        <div class="reading-content">
          <div class="reading-block">
            <h3 class="block-title">卦辞</h3>
            <p>{{ result.hexagram.judgment }}</p>
          </div>
          <div class="reading-block">
            <h3 class="block-title">彖传</h3>
            <p>{{ result.hexagram.tuan }}</p>
          </div>
          <div class="reading-block">
            <h3 class="block-title">大象</h3>
            <p>{{ result.hexagram.daxiang }}</p>
          </div>
          <div class="reading-block highlight-block">
            <h3 class="block-title">⚡ 动爻启示</h3>
            <p>{{ result.yaoInterpretation }}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="综合建议" icon="💡">
        <div class="advice-content">
          <p class="advice-text">{{ result.advice }}</p>
          <div class="advice-tags">
            <span class="advice-tag" :class="result.overall.trend">
              {{ result.overall.label }}
            </span>
            <span class="advice-tag direction">{{ result.overall.direction }}</span>
          </div>
        </div>
      </SectionCard>
    </div>

    <div class="page-footer">
      <p class="footer-note">梅花易数由北宋邵雍（邵康节）创立，以"象数易"为核心，灵活简便，重象轻爻。</p>
    </div>
    <TheoryInfo title="梅花易数" :sections="meihuaTheory" :sources="meihuaSources" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SectionCard from '@/components/SectionCard.vue'
import TheoryInfo from '@/components/TheoryInfo.vue'

const meihuaTheory = [
  { heading: '历史渊源', lines: ['北宋邵雍（邵康节）所创，载于《梅花易数》与《皇极经世》。相传邵雍观梅占雀，以卦象断吉凶，由此得名。'] },
  { heading: '起卦法则', lines: ['以三个数字分别计算上卦、下卦、动爻。数字与八卦对应：1乾☰ 2兑☱ 3离☲ 4震☳ 5巽☴ 6坎☵ 7艮☶ 8坤☷，模8取卦；动爻模6取爻。'] },
  { heading: '体用生克', lines: ['本卦中无动爻之卦为体卦（代表主方），有动爻之卦为用卦（代表客方）。体用生克关系决定吉凶趋势：体克用吉，用克体凶，体生用泄，用生体吉。'] },
  { heading: '八卦类象', lines: ['乾(天/父/君)、兑(泽/少女/口)、离(火/中女/目)、震(雷/长男/足)、巽(风/长女/股)、坎(水/中男/耳)、艮(山/少男/手)、坤(地/母/腹)。'] },
]
const meihuaSources = ['邵雍《梅花易数》', '邵雍《皇极经世》', '《周易》（《易经》卦爻辞）']

const num1 = ref(3)
const num2 = ref(8)
const num3 = ref(6)

const result = ref(null)
const showYaoDetail = ref(false)

function toggleYao(i) {
  if (i === result.value?.movingYao) {
    showYaoDetail.value = !showYaoDetail.value
  }
}

const presets = [
  { label: '今日运势', nums: [new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear() % 100] },
  { label: '感情', nums: [3, 7, 5] },
  { label: '事业', nums: [6, 9, 3] },
  { label: '财运', nums: [8, 2, 4] },
]

const TRIGRAMS = [
  { index: 1, name: '乾', symbol: '☰', nature: '天', attr: '健' },
  { index: 2, name: '兑', symbol: '☱', nature: '泽', attr: '悦' },
  { index: 3, name: '离', symbol: '☲', nature: '火', attr: '丽' },
  { index: 4, name: '震', symbol: '☳', nature: '雷', attr: '动' },
  { index: 5, name: '巽', symbol: '☴', nature: '风', attr: '入' },
  { index: 6, name: '坎', symbol: '☵', nature: '水', attr: '陷' },
  { index: 7, name: '艮', symbol: '☶', nature: '山', attr: '止' },
  { index: 8, name: '坤', symbol: '☷', nature: '地', attr: '顺' },
]

const HEXAGRAM_DATA = {
  '1-1': {
    name: '乾为天', title: '刚健中正',
    judgment: '元亨利贞。天行健，君子以自强不息。',
    tuan: '大哉乾元！万物资始，乃统天。云行雨施，品物流形。',
    daxiang: '天行健，君子以自强不息。',
  },
  '1-2': {
    name: '天泽履', title: '如履薄冰',
    judgment: '履虎尾，不咥人，亨。',
    tuan: '履，柔履刚也。说而应乎乾，是以履虎尾，不咥人，亨。',
    daxiang: '上天下泽，履。君子以辩上下，定民志。',
  },
  '1-3': {
    name: '天火同人', title: '团结大同',
    judgment: '同人于野，亨。利涉大川，利君子贞。',
    tuan: '同人，柔得位得中而应乎乾，曰同人。',
    daxiang: '天与火，同人。君子以类族辨物。',
  },
  '1-4': {
    name: '天雷无妄', title: '顺其自然',
    judgment: '元亨利贞。其匪正有眚，不利有攸往。',
    tuan: '无妄，刚自外来而为主于内。动而健，刚中而应。',
    daxiang: '天下雷行，物与无妄。君子以茂对时育万物。',
  },
  '1-5': {
    name: '天风姤', title: '不期而遇',
    judgment: '女壮，勿用取女。',
    tuan: '姤，遇也，柔遇刚也。勿用取女，不可与长也。',
    daxiang: '天下有风，姤。后以施命诰四方。',
  },
  '1-6': {
    name: '天水讼', title: '慎争戒讼',
    judgment: '有孚，窒惕，中吉，终凶。利见大人，不利涉大川。',
    tuan: '讼，上刚下险，险而健，讼。',
    daxiang: '天与水违行，讼。君子以作事谋始。',
  },
  '1-7': {
    name: '天山遁', title: '暂避锋芒',
    judgment: '亨小，利贞。',
    tuan: '遁亨，遁而亨也。刚当位而应，与时行也。',
    daxiang: '天下有山，遁。君子以远小人，不恶而严。',
  },
  '1-8': {
    name: '天地否', title: '闭塞不通',
    judgment: '否之匪人，不利君子贞，大往小来。',
    tuan: '否之匪人，不利君子贞，大往小来，则是天地不交而万物不通也。',
    daxiang: '天地不交，否。君子以俭德辟难，不可荣以禄。',
  },
  '2-1': {
    name: '泽天夬', title: '决断果敢',
    judgment: '扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。',
    tuan: '夬，决也，刚决柔也。健而说，决而和。',
    daxiang: '泽上于天，夬。君子以施禄及下，居德则忌。',
  },
  '2-2': {
    name: '兑为泽', title: '和悦沟通',
    judgment: '亨，利贞。',
    tuan: '兑，说也。刚中而柔外，说以利贞。',
    daxiang: '丽泽，兑。君子以朋友讲习。',
  },
  '2-3': {
    name: '泽火革', title: '破旧立新',
    judgment: '巳日乃孚，元亨利贞，悔亡。',
    tuan: '革，水火相息，二女同居，其志不相得，曰革。',
    daxiang: '泽中有火，革。君子以治历明时。',
  },
  '2-4': {
    name: '泽雷随', title: '顺势而为',
    judgment: '元亨利贞，无咎。',
    tuan: '随，刚来而下柔，动而说，随。',
    daxiang: '泽中有雷，随。君子以向晦入宴息。',
  },
  '2-5': {
    name: '泽风大过', title: '力挽狂澜',
    judgment: '栋桡，利有攸往，亨。',
    tuan: '大过，大者过也。栋桡，本末弱也。',
    daxiang: '泽灭木，大过。君子以独立不惧，遁世无闷。',
  },
  '2-6': {
    name: '泽水困', title: '困境磨砺',
    judgment: '亨，贞，大人吉，无咎。有言不信。',
    tuan: '困，刚掩也。险以说，困而不失其所亨。',
    daxiang: '泽无水，困。君子以致命遂志。',
  },
  '2-7': {
    name: '泽山咸', title: '感应相通',
    judgment: '亨，利贞，取女吉。',
    tuan: '咸，感也。柔上而刚下，二气感应以相与。',
    daxiang: '山上有泽，咸。君子以虚受人。',
  },
  '2-8': {
    name: '泽地萃', title: '聚集英才',
    judgment: '亨，王假有庙，利见大人，亨，利贞。',
    tuan: '萃，聚也。顺以说，刚中而应，故聚也。',
    daxiang: '泽上于地，萃。君子以除戎器，戒不虞。',
  },
  '3-1': {
    name: '火天大有', title: '丰收富足',
    judgment: '元亨。',
    tuan: '大有，柔得尊位大中，而上下应之，曰大有。其德刚健而文明。',
    daxiang: '火在天上，大有。君子以遏恶扬善，顺天休命。',
  },
  '3-2': {
    name: '火泽睽', title: '求同存异',
    judgment: '小事吉。',
    tuan: '睽，火动而上，泽动而下。二女同居，其志不同行。',
    daxiang: '上火下泽，睽。君子以同而异。',
  },
  '3-3': {
    name: '离为火', title: '光明依附',
    judgment: '利贞，亨。畜牝牛，吉。',
    tuan: '离，丽也。日月丽乎天，百谷草木丽乎土。',
    daxiang: '明两作，离。大人以继明照于四方。',
  },
  '3-4': {
    name: '火雷噬嗑', title: '破除障碍',
    judgment: '亨，利用狱。',
    tuan: '颐中有物，曰噬嗑。噬嗑而亨。',
    daxiang: '雷电，噬嗑。先王以明罚敕法。',
  },
  '3-5': {
    name: '火风鼎', title: '革故鼎新',
    judgment: '元吉，亨。',
    tuan: '鼎，象也。以木巽火，亨饪也。圣人亨以享上帝。',
    daxiang: '木上有火，鼎。君子以正位凝命。',
  },
  '3-6': {
    name: '火水未济', title: '事未成而可为',
    judgment: '亨，小狐汔济，濡其尾，无攸利。',
    tuan: '未济，亨，柔得中也。小狐汔济，未出中也。',
    daxiang: '火在水上，未济。君子以慎辨物居方。',
  },
  '3-7': {
    name: '火山旅', title: '漂泊不定',
    judgment: '旅，小亨，旅贞吉。',
    tuan: '旅，小亨，柔得中乎外而顺乎刚。',
    daxiang: '山上有火，旅。君子以明慎用刑而不留狱。',
  },
  '3-8': {
    name: '火地晋', title: '旭日东升',
    judgment: '康侯用锡马蕃庶，昼日三接。',
    tuan: '晋，进也。明出地上，顺而丽乎大明。',
    daxiang: '明出地上，晋。君子以自昭明德。',
  },
  '4-1': {
    name: '雷天大壮', title: '强盛勿躁',
    judgment: '利贞。',
    tuan: '大壮，大者壮也。刚以动，故壮。',
    daxiang: '雷在天上，大壮。君子以非礼弗履。',
  },
  '4-2': {
    name: '雷泽归妹', title: '姻缘归宿',
    judgment: '征凶，无攸利。',
    tuan: '归妹，天地之大义也。天地不交而万物不兴。',
    daxiang: '泽上有雷，归妹。君子以永终知敝。',
  },
  '4-3': {
    name: '雷火丰', title: '盛极防衰',
    judgment: '亨，王假之，勿忧，宜日中。',
    tuan: '丰，大也。明以动，故丰。',
    daxiang: '雷电皆至，丰。君子以折狱致刑。',
  },
  '4-4': {
    name: '震为雷', title: '临危不惧',
    judgment: '亨。震来虩虩，笑言哑哑，震惊百里，不丧匕鬯。',
    tuan: '震，亨。震来虩虩，恐致福也。笑言哑哑，后有则也。',
    daxiang: '洊雷，震。君子以恐惧修省。',
  },
  '4-5': {
    name: '雷风恒', title: '持之以恒',
    judgment: '亨，无咎，利贞，利有攸往。',
    tuan: '恒，久也。刚上而柔下，雷风相与。',
    daxiang: '雷风，恒。君子以立不易方。',
  },
  '4-6': {
    name: '雷水解', title: '解脱困境',
    judgment: '利西南，无所往，其来复吉，有攸往，夙吉。',
    tuan: '解，险以动，动而免乎险，解。',
    daxiang: '雷雨作，解。君子以赦过宥罪。',
  },
  '4-7': {
    name: '雷山小过', title: '小事可过',
    judgment: '亨，利贞，可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。',
    tuan: '小过，小者过而亨也。过以利贞，与时行也。',
    daxiang: '山上有雷，小过。君子以行过乎恭，丧过乎哀，用过乎俭。',
  },
  '4-8': {
    name: '雷地豫', title: '安乐和顺',
    judgment: '利建侯行师。',
    tuan: '豫，刚应而志行，顺以动，豫。',
    daxiang: '雷出地奋，豫。先王以作乐崇德。',
  },
  '5-1': {
    name: '风天小畜', title: '小有积蓄',
    judgment: '亨，密云不雨，自我西郊。',
    tuan: '小畜，柔得位而上下应之，曰小畜。健而巽，刚中而志行。',
    daxiang: '风行天上，小畜。君子以懿文德。',
  },
  '5-2': {
    name: '风泽中孚', title: '诚信立身',
    judgment: '豚鱼吉，利涉大川，利贞。',
    tuan: '中孚，柔在内而刚得中。说而巽，孚乃化邦也。',
    daxiang: '泽上有风，中孚。君子以议狱缓死。',
  },
  '5-3': {
    name: '风火家人', title: '和睦家庭',
    judgment: '利女贞。',
    tuan: '家人，女正位乎内，男正位乎外。男女正，天地之大义也。',
    daxiang: '风自火出，家人。君子以言有物而行有恒。',
  },
  '5-4': {
    name: '风雷益', title: '互利共赢',
    judgment: '利有攸往，利涉大川。',
    tuan: '益，损上益下，民说无疆。自上下下，其道大光。',
    daxiang: '风雷，益。君子以见善则迁，有过则改。',
  },
  '5-5': {
    name: '巽为风', title: '柔顺渗透',
    judgment: '小亨，利有攸往，利见大人。',
    tuan: '重巽以申命。刚巽乎中正而志行。',
    daxiang: '随风，巽。君子以申命行事。',
  },
  '5-6': {
    name: '风水涣', title: '涣散重聚',
    judgment: '亨，王假有庙，利涉大川，利贞。',
    tuan: '涣，亨。刚来而不穷，柔得位乎外而上同。',
    daxiang: '风行水上，涣。先王以享于帝立庙。',
  },
  '5-7': {
    name: '风山渐', title: '循序渐进',
    judgment: '女归吉，利贞。',
    tuan: '渐之进也，女归吉也。进得位，往有功也。',
    daxiang: '山上有木，渐。君子以居贤德善俗。',
  },
  '5-8': {
    name: '风地观', title: '静观其变',
    judgment: '盥而不荐，有孚颙若。',
    tuan: '大观在上，顺而巽，中正以观天下。',
    daxiang: '风行地上，观。先王以省方观民设教。',
  },
  '6-1': {
    name: '水天需', title: '等待时机',
    judgment: '有孚，光亨，贞吉，利涉大川。',
    tuan: '需，须也。险在前也，刚健而不陷，其义不困穷矣。',
    daxiang: '云上于天，需。君子以饮食宴乐。',
  },
  '6-2': {
    name: '水泽节', title: '适度节制',
    judgment: '亨，苦节不可贞。',
    tuan: '节，亨。刚柔分而刚得中。苦节不可贞，其道穷也。',
    daxiang: '泽上有水，节。君子以制数度，议德行。',
  },
  '6-3': {
    name: '水火既济', title: '功成守成',
    judgment: '亨小，利贞。初吉终乱。',
    tuan: '既济，亨小者，亨也。利贞，刚柔正而位当也。',
    daxiang: '水在火上，既济。君子以思患而预防之。',
  },
  '6-4': {
    name: '水雷屯', title: '万事开头难',
    judgment: '元亨利贞，勿用有攸往，利建侯。',
    tuan: '屯，刚柔始交而难生。动乎险中，大亨贞。',
    daxiang: '云雷，屯。君子以经纶。',
  },
  '6-5': {
    name: '水风井', title: '取之不竭',
    judgment: '改邑不改井，无丧无得，往来井井。汔至亦未繘井，羸其瓶，凶。',
    tuan: '巽乎水而上水，井。井养而不穷也。',
    daxiang: '木上有水，井。君子以劳民劝相。',
  },
  '6-6': {
    name: '坎为水', title: '险中求进',
    judgment: '习坎，有孚，维心亨，行有尚。',
    tuan: '习坎，重险也。水流而不盈，行险而不失其信。',
    daxiang: '水洊至，习坎。君子以常德行，习教事。',
  },
  '6-7': {
    name: '水山蹇', title: '知难而进',
    judgment: '利西南，不利东北。利见大人，贞吉。',
    tuan: '蹇，难也，险在前也。见险而能止，知矣哉。',
    daxiang: '山上有水，蹇。君子以反身修德。',
  },
  '6-8': {
    name: '水地比', title: '亲附团结',
    judgment: '吉。原筮，元永贞，无咎。不宁方来，后夫凶。',
    tuan: '比，吉也。比，辅也，下顺从也。',
    daxiang: '地上有水，比。先王以建万国，亲诸侯。',
  },
  '7-1': {
    name: '山天大畜', title: '厚积薄发',
    judgment: '利贞，不家食吉，利涉大川。',
    tuan: '大畜，刚健笃实辉光，日新其德。',
    daxiang: '天在山中，大畜。君子以多识前言往行，以畜其德。',
  },
  '7-2': {
    name: '山泽损', title: '损己利人',
    judgment: '有孚，元吉，无咎，可贞，利有攸往。曷之用，二簋可用享。',
    tuan: '损，损下益上，其道上行。损而有孚，元吉。',
    daxiang: '山下有泽，损。君子以惩忿窒欲。',
  },
  '7-3': {
    name: '山火贲', title: '文饰适度',
    judgment: '亨，小利有攸往。',
    tuan: '贲，亨。柔来而文刚，故亨。分刚上而文柔。',
    daxiang: '山下有火，贲。君子以明庶政，无敢折狱。',
  },
  '7-4': {
    name: '山雷颐', title: '养正之道',
    judgment: '贞吉。观颐，自求口实。',
    tuan: '颐，贞吉，养正则吉也。观颐，观其所养也。',
    daxiang: '山下有雷，颐。君子以慎言语，节饮食。',
  },
  '7-5': {
    name: '山风蛊', title: '整治腐败',
    judgment: '元亨，利涉大川。先甲三日，后甲三日。',
    tuan: '蛊，刚上而柔下，巽而止，蛊。',
    daxiang: '山下有风，蛊。君子以振民育德。',
  },
  '7-6': {
    name: '山水蒙', title: '启蒙开智',
    judgment: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。',
    tuan: '蒙，山下有险，险而止，蒙。',
    daxiang: '山下出泉，蒙。君子以果行育德。',
  },
  '7-7': {
    name: '艮为山', title: '适可而止',
    judgment: '艮其背，不获其身，行其庭，不见其人，无咎。',
    tuan: '艮，止也。时止则止，时行则行，动静不失其时，其道光明。',
    daxiang: '兼山，艮。君子以思不出其位。',
  },
  '7-8': {
    name: '山地剥', title: '剥落复生',
    judgment: '不利有攸往。',
    tuan: '剥，剥也，柔变刚也。不利有攸往，小人长也。',
    daxiang: '山附于地，剥。上以厚下安宅。',
  },
  '8-1': {
    name: '地天泰', title: '国泰民安',
    judgment: '小往大来，吉亨。',
    tuan: '泰，小往大来，吉亨。则是天地交而万物通也。',
    daxiang: '天地交，泰。后以财成天地之道，辅相天地之宜。',
  },
  '8-2': {
    name: '地泽临', title: '亲临督导',
    judgment: '元亨利贞。至于八月有凶。',
    tuan: '临，刚浸而长，说而顺，刚中而应。',
    daxiang: '泽上有地，临。君子以教思无穷，容保民无疆。',
  },
  '8-3': {
    name: '地火明夷', title: '韬光养晦',
    judgment: '利艰贞。',
    tuan: '明入地中，明夷。内文明而外柔顺，以蒙大难。',
    daxiang: '明入地中，明夷。君子以莅众，用晦而明。',
  },
  '8-4': {
    name: '地雷复', title: '一阳来复',
    judgment: '亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。',
    tuan: '复，亨。刚反动而以顺行。是以出入无疾，朋来无咎。',
    daxiang: '雷在地中，复。先王以至日闭关，商旅不行。',
  },
  '8-5': {
    name: '地风升', title: '步步高升',
    judgment: '元亨，用见大人，勿恤，南征吉。',
    tuan: '柔以时升，巽而顺，刚中而应，是以大亨。',
    daxiang: '地中生木，升。君子以顺德，积小以高大。',
  },
  '8-6': {
    name: '地水师', title: '统率之道',
    judgment: '贞，丈人吉，无咎。',
    tuan: '师，众也。贞，正也。能以众正，可以王矣。',
    daxiang: '地中有水，师。君子以容民畜众。',
  },
  '8-7': {
    name: '地山谦', title: '谦虚受益',
    judgment: '亨，君子有终。',
    tuan: '谦亨，天道下济而光明，地道卑而上行。天道亏盈而益谦。',
    daxiang: '地中有山，谦。君子以裒多益寡，称物平施。',
  },
  '8-8': {
    name: '坤为地', title: '厚德载物',
    judgment: '元亨，利牝马之贞。君子有攸往，先迷后得主，利。',
    tuan: '至哉坤元！万物资生，乃顺承天。坤厚载物，德合无疆。',
    daxiang: '地势坤，君子以厚德载物。',
  },
}

const YAO_TEXTS = {
  '乾': ['潜龙勿用', '见龙在田，利见大人', '君子终日乾乾，夕惕若，厉无咎', '或跃在渊，无咎', '飞龙在天，利见大人', '亢龙有悔'],
}

function getYaoInterpretation(upperIdx, lowerIdx, movingYao) {
  const theme = HEXAGRAM_DATA[`${upperIdx}-${lowerIdx}`]
  if (!theme) return '此卦变化微妙，宜静观其变。'

  const texts = [
    '事物处于萌芽阶段，宜潜藏积蓄力量，不可轻举妄动。',
    '初现端倪，适合展现自己，寻求贵人相助。',
    '处于关键转折点，需要勤勉不懈，谨言慎行。',
    '面临选择，审时度势后可大胆进取。',
    '已至高位，大展宏图之时，利见大人。',
    '盛极当思退，物极必反，宜收敛低调。',
  ]

  return texts[movingYao] || '此爻变动，暗示事物正在变化之中。'
}

function getAdvice(upperIdx, lowerIdx, movingYao) {
  const pairs = {
    '1-1': '刚健有为，自强不息。当前宜积极主动，但不可过于刚愎。',
    '1-8': '天地不交，宜守不宜攻。耐心等待时机，不可强求。',
    '2-2': '以和悦之心待人接物，沟通交流可化解矛盾。',
    '3-3': '光明正大，依附正道。适合展示才华，但需谦逊。',
    '4-4': '虽有惊雷，但能从容应对。恐惧过后必有福至。',
    '5-5': '以柔克刚，渐进而行。不宜急躁，小事可成。',
    '6-6': '身处险境而心不乱，保持诚信可渡过难关。',
    '7-7': '当止则止，审时度势。此时不宜冒进。',
    '8-8': '厚德载物，以柔顺包容之心面对一切。',
  }
  return pairs[`${upperIdx}-${lowerIdx}`] || '卦象显示当前宜顺势而为，不可逆势强求。具体应结合自身实际情况判断。'
}

function getTrend(upperIdx, lowerIdx, movingYao) {
  if (upperIdx === lowerIdx) return movingYao <= 2 ? '平稳' : '变动'
  if ((upperIdx === 1 && lowerIdx === 8) || (upperIdx === 8 && lowerIdx === 1)) return '大吉'
  if (upperIdx === 3 && lowerIdx === 6) return '有成'
  if (upperIdx === 6 && lowerIdx === 3) return '守成'
  return upperIdx < lowerIdx ? '上升' : '调整'
}

function applyPreset(p) {
  num1.value = p.nums[0]
  num2.value = p.nums[1]
  num3.value = p.nums[2]
  castDivination()
}

function castDivination() {
  showYaoDetail.value = false
  const upperIdx = ((num1.value - 1) % 8) + 1
  const lowerIdx = ((num2.value - 1) % 8) + 1
  const movingYao = ((num3.value - 1) % 6)

  const upper = TRIGRAMS.find(t => t.index === upperIdx)
  const lower = TRIGRAMS.find(t => t.index === lowerIdx)

  const hexKey = `${upperIdx}-${lowerIdx}`
  const hexData = HEXAGRAM_DATA[hexKey] || {
    name: `${upper.name}${lower.name}合卦`,
    title: '变化之象',
    judgment: '此卦象变化万千，宜结合实际情境灵活解读。',
    tuan: '刚柔交错，变化无常。',
    daxiang: '观象玩辞，审时度势。',
  }

  const lines = []
  const trigramLines = {
    1: [1, 1, 1], 2: [0, 1, 1], 3: [1, 0, 1], 4: [1, 1, 0],
    5: [0, 0, 1], 6: [0, 1, 0], 7: [1, 0, 0], 8: [0, 0, 0],
  }

  const upperLines = trigramLines[upperIdx]
  const lowerLines = trigramLines[lowerIdx]
  const allLines = [...upperLines, ...lowerLines]

  result.value = {
    upperTrigram: upper,
    lowerTrigram: lower,
    hexagram: {
      ...hexData,
      lines: allLines,
    },
    movingYao,
    yaoText: YAO_TEXTS[upper.name]?.[movingYao] || `第${6 - movingYao}爻变化中`,
    yaoInterpretation: getYaoInterpretation(upperIdx, lowerIdx, movingYao),
    advice: getAdvice(upperIdx, lowerIdx, movingYao),
    overall: {
      trend: getTrend(upperIdx, lowerIdx, movingYao),
      label: `趋势：${getTrend(upperIdx, lowerIdx, movingYao)}`,
      direction: `宜：顺势 · 忌：强求`,
    },
  }
}
</script>

<style scoped>
.meihua {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 80px;
  overflow-x: hidden;
}

.page-hero {
  text-align: center;
  padding: 56px 24px 40px;
  position: relative;
}

.hero-bg {
  font-size: 180px;
  opacity: 0.04;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
}

.hero-title {
  font-family: var(--font-chinese);
  font-size: 42px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold), var(--teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 6px;
  position: relative;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 15px;
  color: var(--text-secondary);
  letter-spacing: 2px;
}

.form-section {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.form-card {
  width: 100%;
  max-width: 600px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  padding: 32px 36px;
  box-shadow: var(--shadow-card);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border-gold);
  font-family: var(--font-chinese);
  font-size: 18px;
  font-weight: 700;
  color: var(--gold);
}

.form-icon { font-size: 22px; }

.form-hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
}

.num-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
  min-width: 0;
}

.num-inputs :deep(.el-input-number) {
  width: 100%;
}

.num-inputs :deep(.el-input-number .el-input__wrapper) {
  padding-left: 8px;
  padding-right: 8px;
}

.num-inputs :deep(.el-input-number .el-input__inner) {
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
}

.num-inputs :deep(.el-input-number__increase),
.num-inputs :deep(.el-input-number__decrease) {
  width: 24px;
}

.num-inputs :deep(.el-form-item) {
  margin-bottom: 0;
  min-width: 0;
}

.num-inputs :deep(.el-form-item__content) {
  min-width: 0;
}

.cast-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  background: var(--cast-bg);
  border: none;
  color: var(--cast-text);
  border-radius: 10px;
}

.cast-btn:hover {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  box-shadow: 0 8px 32px rgba(196, 154, 74, 0.25);
}

.quick-presets {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-gold);
}

.preset-label {
  font-size: 13px;
  color: var(--text-muted);
}

.result-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-width: 0;
}

.result-section > .section-card:first-child {
  grid-column: 1 / -1;
}

/* 卦象显示 */
.hexagram-display {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  flex-wrap: wrap;
  min-width: 0;
}

.trigram-group {
  flex-shrink: 0;
}

.trigram-label {
  font-family: var(--font-chinese);
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 1px;
}

.hexagram-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.hex-line {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: default;
  transition: all 0.3s;
  padding: 2px 0;
  min-width: 0;
}

.hex-line.moving {
  cursor: pointer;
}

.hex-line.moving:hover {
  background: rgba(196, 154, 74, 0.06);
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 -4px;
}

.line-num {
  font-size: 11px;
  color: var(--text-muted);
  width: 14px;
  text-align: right;
}

.line-bar {
  display: flex;
  align-items: center;
  height: 20px;
}

.bar {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 1;
  min-width: 0;
}

.bar-seg {
  width: 36px;
  max-width: 14vw;
  height: 6px;
  border-radius: 3px;
  background: var(--text-primary);
  transition: background 0.3s;
  flex-shrink: 1;
}

.hex-line.moving .bar-seg {
  background: var(--gold);
}

.bar-gap {
  width: 8px;
  flex-shrink: 0;
}

.moving-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(196, 154, 74, 0.2);
  color: var(--gold);
  font-weight: 700;
  margin-left: 4px;
}

.trigram-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 8px;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.trigram-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  flex-wrap: wrap;
  min-width: 0;
}

.info-key {
  color: var(--text-muted);
  font-family: var(--font-chinese);
}

.info-val {
  color: var(--text-primary);
  font-family: var(--font-chinese);
  font-weight: 600;
  overflow-wrap: break-word;
  word-break: break-word;
}

.info-val.moving {
  color: var(--gold);
}

.yao-detail {
  margin-top: 20px;
  padding: 16px 20px;
  background: var(--gold-dim);
  border-radius: 8px;
  border: 1px solid var(--border-gold);
}

.yao-detail p {
  font-family: var(--font-chinese);
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.8;
}

/* 解读 */
.reading-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  min-width: 0;
}

.reading-block {
  padding: 16px;
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.reading-block.highlight-block {
  grid-column: 1 / -1;
  background: var(--gold-dim);
  border: 1px solid var(--border-gold);
}

.block-title {
  font-family: var(--font-chinese);
  font-size: 15px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 8px;
}

.reading-block p {
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-primary);
}

/* 建议 */
.advice-content {
  text-align: center;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.advice-text {
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.advice-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.advice-tag {
  display: inline-block;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.advice-tag.大吉 { background: rgba(122, 158, 106, 0.12); color: var(--accent-green); border: 1px solid rgba(122, 158, 106, 0.2); }
.advice-tag.上升 { background: rgba(106, 142, 174, 0.12); color: var(--accent-blue); border: 1px solid rgba(106, 142, 174, 0.2); }
.advice-tag.平稳 { background: rgba(196, 154, 74, 0.12); color: var(--accent-yellow); border: 1px solid rgba(196, 154, 74, 0.2); }
.advice-tag.变动 { background: rgba(196, 102, 90, 0.12); color: var(--accent-red); border: 1px solid rgba(196, 102, 90, 0.2); }
.advice-tag.守成 { background: rgba(196, 154, 74, 0.12); color: var(--gold); border: 1px solid var(--border-gold); }
.advice-tag.调整 { background: rgba(196, 102, 90, 0.12); color: var(--accent-red); border: 1px solid rgba(196, 102, 90, 0.2); }
.advice-tag.有成 { background: rgba(122, 158, 106, 0.12); color: var(--accent-green); border: 1px solid rgba(122, 158, 106, 0.2); }

.advice-tag.direction {
  background: var(--gold-dim);
  color: var(--gold);
  border-color: var(--border-gold);
}

.page-footer {
  text-align: center;
  padding-top: 48px;
}

.footer-note {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .hero-title { font-size: 32px; }
  .form-card { padding: 24px 16px; }
  .num-inputs { grid-template-columns: 1fr; gap: 8px; }
  .result-section { grid-template-columns: 1fr; }
  .reading-content { grid-template-columns: 1fr; }
  .reading-block.highlight-block { grid-column: 1; }
  .hexagram-display { flex-direction: column; gap: 20px; }
  .trigram-meta { padding-top: 0; }
  .bar-seg { max-width: 32px; }
  .hexagram-lines { align-items: flex-start; }
}

@media (max-width: 480px) {
  .bar-seg { max-width: 24px; }
  .hex-line { gap: 4px; }
  .info-val { font-size: 13px; }
}
</style>
