const TAI_YI_PALACE_CYCLE = [6, 9, 8, 3, 7, 2, 1, 4]
const PALACE_NAMES = { 1: '坎', 2: '坤', 3: '震', 4: '巽', 5: '中', 6: '乾', 7: '兑', 8: '艮', 9: '离' }
const PALACE_DIRECTIONS = { 1: '北', 2: '西南', 3: '东', 4: '东南', 5: '中', 6: '西北', 7: '西', 8: '东北', 9: '南' }
const PALACE_ELEMENTS = { 1: '水', 2: '土', 3: '木', 4: '木', 5: '土', 6: '金', 7: '金', 8: '土', 9: '火' }

const SHI_LIU_SHEN = [
  { name: '子神', zhi: '子', palace: 1 },
  { name: '丑神', zhi: '丑', palace: 8 },
  { name: '艮神', zhi: '', palace: 8 },
  { name: '寅神', zhi: '寅', palace: 8 },
  { name: '卯神', zhi: '卯', palace: 3 },
  { name: '辰神', zhi: '辰', palace: 4 },
  { name: '巽神', zhi: '', palace: 4 },
  { name: '巳神', zhi: '巳', palace: 4 },
  { name: '午神', zhi: '午', palace: 9 },
  { name: '未神', zhi: '未', palace: 2 },
  { name: '坤神', zhi: '', palace: 2 },
  { name: '申神', zhi: '申', palace: 2 },
  { name: '酉神', zhi: '酉', palace: 7 },
  { name: '戌神', zhi: '戌', palace: 6 },
  { name: '乾神', zhi: '', palace: 6 },
  { name: '亥神', zhi: '亥', palace: 6 },
]

function calcJiNian(year) {
  return year + 10153917
}

function calcTaiYiPalace(jiNian) {
  const cycleIdx = Math.floor((jiNian - 1) / 3) % 8
  return TAI_YI_PALACE_CYCLE[cycleIdx]
}

function calcWenChang(taiYiPalace) {
  return 10 - taiYiPalace
}

function calcZhuSuan(taiYiPalace, wenChangPalace) {
  return wenChangPalace
}

function calcKeSuan(taiYiPalace, wenChangPalace) {
  return taiYiPalace
}

function calcJiShen(taiYiPalace) {
  const map = { 6: 4, 9: 1, 8: 2, 3: 7, 7: 3, 2: 8, 1: 9, 4: 6 }
  return map[taiYiPalace] || 5
}

function calcZhuDaJiang(wenChangPalace, zhuSuan) {
  return wenChangPalace
}

function calcKeDaJiang(taiYiPalace, keSuan) {
  return taiYiPalace
}

function distributeShen(pan, taiYiPalace) {
  for (const shen of SHI_LIU_SHEN) {
    if (!pan[shen.palace].shenList) pan[shen.palace].shenList = []
    pan[shen.palace].shenList.push(shen.name)
  }
}

export function calculateTaiYi({ year, month, day }) {
  const jiNian = calcJiNian(year)
  const taiYiPalace = calcTaiYiPalace(jiNian)
  const wenChangPalace = calcWenChang(taiYiPalace)
  const zhuSuan = calcZhuSuan(taiYiPalace, wenChangPalace)
  const keSuan = calcKeSuan(taiYiPalace, wenChangPalace)
  const jiShenPalace = calcJiShen(taiYiPalace)
  const zhuDaJiangPalace = calcZhuDaJiang(wenChangPalace, zhuSuan)
  const keDaJiangPalace = calcKeDaJiang(taiYiPalace, keSuan)

  const pan = {}
  for (let p = 1; p <= 9; p++) {
    pan[p] = {
      palace: p,
      name: PALACE_NAMES[p],
      direction: PALACE_DIRECTIONS[p],
      element: PALACE_ELEMENTS[p],
      shenList: [],
      stars: [],
    }
  }

  distributeShen(pan, taiYiPalace)
  pan[taiYiPalace].stars.push('太乙')
  pan[wenChangPalace].stars.push('文昌')
  pan[jiShenPalace].stars.push('计神')
  pan[zhuDaJiangPalace].stars.push('主大将')
  pan[keDaJiangPalace].stars.push('客大将')

  return {
    date: { year, month, day },
    jiNian,
    taiYi: { palace: taiYiPalace, name: PALACE_NAMES[taiYiPalace] },
    wenChang: { palace: wenChangPalace, name: PALACE_NAMES[wenChangPalace] },
    jiShen: { palace: jiShenPalace, name: PALACE_NAMES[jiShenPalace] },
    zhuDaJiang: { palace: zhuDaJiangPalace, name: PALACE_NAMES[zhuDaJiangPalace] },
    keDaJiang: { palace: keDaJiangPalace, name: PALACE_NAMES[keDaJiangPalace] },
    zhuSuan,
    keSuan,
    pan,
    cycleYear: ((jiNian - 1) % 24) + 1,
  }
}
