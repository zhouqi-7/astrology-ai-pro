import solarLunar from 'solarlunar'

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const YANG_DUN_TABLE = {
  0: [2, 8, 5], 1: [3, 9, 6], 2: [8, 5, 2],
  3: [9, 6, 3], 4: [1, 7, 4], 5: [3, 9, 6],
  6: [4, 1, 7], 7: [5, 2, 8], 8: [4, 1, 7],
  9: [5, 2, 8], 10: [6, 3, 9], 23: [1, 7, 4],
}
const YIN_DUN_TABLE = {
  11: [9, 3, 6], 12: [8, 2, 5], 13: [7, 1, 4],
  14: [2, 5, 8], 15: [1, 4, 7], 16: [9, 3, 6],
  17: [7, 1, 4], 18: [6, 9, 3], 19: [5, 8, 2],
  20: [6, 9, 3], 21: [5, 8, 2], 22: [4, 7, 1],
}

const YUAN_NAMES = ['上元', '中元', '下元']

const STAR_NAMES = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英']
const STAR_AUSPICE = ['凶', '凶', '吉', '吉', '大吉', '吉', '凶', '吉', '凶']
const STAR_ELEMENT = ['水', '土', '木', '木', '土', '金', '金', '土', '火']
const STAR_ORIGIN = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const DOOR_NAMES = ['休', '死', '伤', '杜', '', '开', '惊', '生', '景']
const DOOR_AUSPICE = ['吉', '凶', '凶', '平', '', '大吉', '凶', '大吉', '平']
const DOOR_ELEMENT = ['水', '土', '木', '木', '', '金', '金', '土', '火']

const SPIRIT_NAMES = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天']

const PALACE_DIRECTIONS = ['北', '西南', '东', '东南', '中', '西北', '西', '东北', '南']
const PALACE_ZHI = {
  1: ['子'], 2: ['未', '申'], 3: ['卯'], 4: ['辰', '巳'],
  5: [], 6: ['戌', '亥'], 7: ['酉'], 8: ['丑', '寅'], 9: ['午'],
}
const PALACE_BAGUA = ['坎', '坤', '震', '巽', '', '乾', '兑', '艮', '离']

const CW_SEQ = [1, 8, 3, 4, 9, 2, 7, 6]
const CW_INDEX = { 1: 0, 8: 1, 3: 2, 4: 3, 9: 4, 2: 5, 7: 6, 6: 7 }

const QI_YI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙']

function parseGanZhi(str) {
  if (!str || str.length < 2) return null
  return { gan: str[0], zhi: str[1], ganIdx: TIAN_GAN.indexOf(str[0]), zhiIdx: DI_ZHI.indexOf(str[1]) }
}

function getGZIndex(str) {
  const p = parseGanZhi(str)
  if (!p) return -1
  for (let i = 0; i < 60; i++) {
    if (i % 10 === p.ganIdx && i % 12 === p.zhiIdx) return i
  }
  return -1
}

function buildTermDates(year) {
  const terms = []
  const prevY = year - 1
  const prevDZDay = solarLunar.getTerm(prevY, 24)
  if (prevDZDay > 0) {
    terms.push({ name: '冬至', idx: 23, date: new Date(prevY, 11, prevDZDay) })
  }
  for (let n = 1; n <= 24; n++) {
    const day = solarLunar.getTerm(year, n)
    if (day < 0) continue
    const m = Math.ceil(n / 2) - 1
    terms.push({ name: solarLunar.lunarTerm[n - 1], idx: n - 1, date: new Date(year, m, day) })
  }
  return terms
}

function findTerm(year, month, day) {
  const date = new Date(year, month - 1, day)
  const terms = buildTermDates(year)
  let current = terms[0]
  for (const t of terms) {
    if (t.date <= date) current = t
    else break
  }
  return current
}

function determineJu(year, month, day) {
  const term = findTerm(year, month, day)
  const date = new Date(year, month - 1, day)
  const daysSince = Math.floor((date - term.date) / 86400000)
  const yuanIdx = Math.floor(daysSince / 5) % 3

  const isYang = term.idx >= 23 || term.idx <= 10
  const table = isYang ? YANG_DUN_TABLE : YIN_DUN_TABLE
  const juNum = table[term.idx] ? table[term.idx][yuanIdx] : 1

  return {
    termName: term.name,
    termIdx: term.idx,
    yuan: YUAN_NAMES[yuanIdx],
    yuanIdx,
    isYang,
    juNum,
    termDate: term.date,
  }
}

function placeEarth(ju, isYang) {
  const earth = {}
  const start = ju
  for (let i = 0; i < 9; i++) {
    const palace = isYang ? ((start - 1 + i) % 9) + 1 : ((start - 1 - i + 9) % 9) + 1
    earth[palace] = QI_YI[i]
  }
  return earth
}

function findXunShou(hourGZIndex) {
  const headIdx = Math.floor(hourGZIndex / 10) * 10
  const gan = TIAN_GAN[headIdx % 10]
  const zhi = DI_ZHI[headIdx % 12]
  return { gan, zhi, name: gan + zhi, idx: headIdx }
}

function getCWPos(palace) {
  return CW_INDEX[palace] !== undefined ? CW_INDEX[palace] : -1
}

function cwStep(from, steps) {
  const idx = getCWPos(from)
  if (idx < 0) return from
  return CW_SEQ[(idx + steps) % 8]
}

const XUN_ZHI_TO_YI = { 子: '戊', 戌: '己', 申: '庚', 午: '辛', 辰: '壬', 寅: '癸' }

function findPalaceOfStem(earth, stem) {
  for (let p = 1; p <= 9; p++) {
    if (earth[p] === stem) return p
  }
  return 0
}

function effectivePalace(p) {
  return p === 5 ? 2 : p
}

function findYiStem(gzStem, gzBranch) {
  if (gzStem === '甲') return XUN_ZHI_TO_YI[gzBranch] || '戊'
  return gzStem
}

function placeHeavenStars(earth, xunShou, hourGan, hourZhi, isYang) {
  const xunYi = XUN_ZHI_TO_YI[xunShou.zhi] || '戊'
  const xunHeadEarthPalace = findPalaceOfStem(earth, xunYi) || 1
  const effectiveHourGan = findYiStem(hourGan, hourZhi)
  const hourGanEarthPalace = findPalaceOfStem(earth, effectiveHourGan) || 1

  const zhifuStarIdx = STAR_ORIGIN.indexOf(effectivePalace(xunHeadEarthPalace))
  const zhifuStarName = zhifuStarIdx >= 0 ? STAR_NAMES[zhifuStarIdx] : '天蓬'
  const zhishiDoorName = DOOR_NAMES[effectivePalace(xunHeadEarthPalace) - 1] || '休'

  const starOrder = STAR_ORIGIN.map((o, i) => ({ name: STAR_NAMES[i], orig: o, auspice: STAR_AUSPICE[i], element: STAR_ELEMENT[i] }))

  const zhifuEffPalace = effectivePalace(STAR_ORIGIN[zhifuStarIdx >= 0 ? zhifuStarIdx : 0])
  const zhifuCWPos = getCWPos(zhifuEffPalace)
  const targetCWPos = getCWPos(hourGanEarthPalace)

  let offset = 0
  if (zhifuCWPos >= 0 && targetCWPos >= 0) {
    offset = (targetCWPos - zhifuCWPos + 8) % 8
  }

  const stars = {}
  for (const star of starOrder) {
    const effOrig = effectivePalace(star.orig)
    const cwPos = getCWPos(effOrig)
    if (cwPos >= 0) {
      const newPalace = CW_SEQ[(cwPos + offset) % 8]
      stars[newPalace] = star
    }
  }

  const heavenStems = {}
  for (const [pStr, star] of Object.entries(stars)) {
    heavenStems[parseInt(pStr)] = earth[star.orig]
  }

  return { zhifuStar: zhifuStarName, zhishiDoor: zhishiDoorName, zhifuPalace: hourGanEarthPalace, stars, heavenStems, offset }
}

function placeDoors(earth, xunShou, hourZhi) {
  const xunYi = XUN_ZHI_TO_YI[xunShou.zhi] || '戊'
  const xunHeadEarthPalace = findPalaceOfStem(earth, xunYi) || 1

  const zhishiEffPalace = effectivePalace(xunHeadEarthPalace)

  const xunZhiIdx = DI_ZHI.indexOf(xunShou.zhi)
  const hourZhiIdx = DI_ZHI.indexOf(hourZhi)
  const steps = (hourZhiIdx - xunZhiIdx + 12) % 12

  const zhishiCWPos = getCWPos(zhishiEffPalace)
  const zhishiNewPalace = zhishiCWPos >= 0 ? CW_SEQ[(zhishiCWPos + steps) % 8] : zhishiEffPalace

  const doorOrder = [
    { name: '休', palace: 1, auspice: '吉', element: '水' },
    { name: '死', palace: 2, auspice: '凶', element: '土' },
    { name: '伤', palace: 3, auspice: '凶', element: '木' },
    { name: '杜', palace: 4, auspice: '平', element: '木' },
    { name: '开', palace: 6, auspice: '大吉', element: '金' },
    { name: '惊', palace: 7, auspice: '凶', element: '金' },
    { name: '生', palace: 8, auspice: '大吉', element: '土' },
    { name: '景', palace: 9, auspice: '平', element: '火' },
  ]

  const zhishiDoor = doorOrder.find(d => d.palace === zhishiEffPalace) || doorOrder[0]
  const zhishiCWInOrder = doorOrder.indexOf(zhishiDoor)

  const doors = {}
  for (let i = 0; i < 8; i++) {
    const door = doorOrder[(zhishiCWInOrder + i) % 8]
    const newPalace = zhishiCWPos >= 0 ? CW_SEQ[(zhishiCWPos + steps + i) % 8] : ((zhishiNewPalace - 1 + i) % 8) + 1
    doors[newPalace] = { ...door }
  }

  return { zhishiDoor: zhishiDoor.name, zhishiNewPalace, doors }
}

function placeSpirits(zhifuPalace, isYang) {
  const spirits = {}
  const zhifuCWPos = getCWPos(zhifuPalace)
  if (zhifuCWPos >= 0) {
    for (let i = 0; i < 8; i++) {
      const seqIdx = isYang ? (zhifuCWPos + i) % 8 : (zhifuCWPos - i + 8) % 8
      const palace = CW_SEQ[seqIdx]
      spirits[palace] = { name: SPIRIT_NAMES[i], seq: i }
    }
  }
  return spirits
}

export function calculateQiMen({ year, month, day, hour }) {
  const sl = solarLunar.solar2lunar(year, month, day)
  const gzDay = sl.gzDay
  const dayGanIdx = TIAN_GAN.indexOf(gzDay[0])

  const hourGZStr = solarLunar.getShiChen(hour, dayGanIdx)
  const hourGZ = parseGanZhi(hourGZStr)
  const hourGZIndex = getGZIndex(hourGZStr)

  const ju = determineJu(year, month, day)
  const earth = placeEarth(ju.juNum, ju.isYang)

  const xunShou = findXunShou(hourGZIndex)

  const heaven = placeHeavenStars(earth, xunShou, hourGZ.gan, hourGZ.zhi, ju.isYang)
  const doors = placeDoors(earth, xunShou, hourGZ.zhi)
  const spirits = placeSpirits(heaven.zhifuPalace, ju.isYang)

  const pan = {}
  for (let p = 1; p <= 9; p++) {
    const entry = {
      earth: earth[p] || '',
      heaven: heaven.heavenStems[p] || '',
      star: heaven.stars[p] ? heaven.stars[p].name : '',
      starAuspice: heaven.stars[p] ? heaven.stars[p].auspice : '',
      starElement: heaven.stars[p] ? heaven.stars[p].element : '',
      door: doors[p] ? doors[p].name : '',
      doorAuspice: doors[p] ? doors[p].auspice : '',
      doorElement: doors[p] ? doors[p].element : '',
      spirit: spirits[p] ? spirits[p].name : '',
      direction: PALACE_DIRECTIONS[p - 1],
      bagua: PALACE_BAGUA[p - 1],
      zhi: PALACE_ZHI[p] || [],
    }
    if (p === 5) {
      entry.star = '天禽'
      entry.starAuspice = '大吉'
      entry.starElement = '土'
      const ruiEntry = Object.entries(heaven.stars).find(([, v]) => v.name === '天芮')
      if (ruiEntry) {
        const ruiPalace = parseInt(ruiEntry[0])
        entry.heaven = heaven.heavenStems[ruiPalace] || ''
        entry.spirit = spirits[ruiPalace] ? spirits[ruiPalace].name : ''
      }
    }
    pan[p] = entry
  }

  const sizhu = {
    year: sl.gzYear,
    month: sl.gzMonth,
    day: sl.gzDay,
    hour: hourGZStr,
  }

  return {
    date: { year, month, day, hour },
    sizhu,
    term: { name: ju.termName, yuan: ju.yuan },
    dungeon: { type: ju.isYang ? '阳' : '阴', number: ju.juNum },
    xunShou: { name: xunShou.name },
    zhifuStar: heaven.zhifuStar,
    zhishiDoor: heaven.zhishiDoor,
    pan,
    offset: heaven.offset,
  }
}
