import solarLunar from 'solarlunar'

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const GAN_WU_XING = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }
const ZHI_WU_XING = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' }

const GAN_SHI_SHENG = {
  甲: { 木: 0, 火: 1, 土: 3, 金: 4, 水: 2 },
  乙: { 木: 0, 火: 1, 土: 3, 金: 4, 水: 2 },
  丙: { 火: 0, 土: 1, 金: 2, 水: 4, 木: 3 },
  丁: { 火: 0, 土: 1, 金: 2, 水: 4, 木: 3 },
  戊: { 土: 0, 金: 1, 水: 2, 木: 3, 火: 4 },
  己: { 土: 0, 金: 1, 水: 2, 木: 3, 火: 4 },
  庚: { 金: 0, 水: 1, 木: 2, 火: 3, 土: 4 },
  辛: { 金: 0, 水: 1, 木: 2, 火: 3, 土: 4 },
  壬: { 水: 0, 木: 1, 火: 2, 土: 3, 金: 4 },
  癸: { 水: 0, 木: 1, 火: 2, 土: 3, 金: 4 },
}

const WU_XING_KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' }

const GAN_JI_GONG = { 甲: '寅', 乙: '辰', 丙: '巳', 丁: '未', 戊: '巳', 己: '未', 庚: '申', 辛: '戌', 壬: '亥', 癸: '丑' }

const ZHONG_QI_TO_YUE_JIANG = {
  2: '子', 4: '亥', 6: '戌', 8: '酉', 10: '申', 12: '未',
  14: '午', 16: '巳', 18: '辰', 20: '卯', 22: '寅', 24: '丑',
}
const YUE_JIANG_NAMES = {
  子: '神后', 丑: '大吉', 寅: '功曹', 卯: '太冲',
  辰: '天罡', 巳: '太乙', 午: '胜光', 未: '小吉',
  申: '传送', 酉: '从魁', 戌: '河魁', 亥: '登明',
}

const TIAN_JIANG_ORDER = ['贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙', '天空', '白虎', '太常', '玄武', '太阴', '天后']

const GUI_REN_TABLE = {
  甲: { day: '丑', night: '未' }, 乙: { day: '子', night: '申' },
  丙: { day: '亥', night: '酉' }, 丁: { day: '亥', night: '酉' },
  戊: { day: '丑', night: '未' }, 己: { day: '子', night: '申' },
  庚: { day: '丑', night: '未' }, 辛: { day: '午', night: '寅' },
  壬: { day: '巳', night: '卯' }, 癸: { day: '巳', night: '卯' },
}

function parseGanZhi(str) {
  if (!str || str.length < 2) return null
  return { gan: str[0], zhi: str[1], ganIdx: GAN.indexOf(str[0]), zhiIdx: ZHI.indexOf(str[1]) }
}

function getGZIndex(str) {
  const p = parseGanZhi(str)
  if (!p) return -1
  for (let i = 0; i < 60; i++) {
    if (i % 10 === p.ganIdx && i % 12 === p.zhiIdx) return i
  }
  return -1
}

function findZhongQi(year, month, day) {
  const date = new Date(year, month - 1, day)
  const candidates = []
  const prevY = year - 1
  const prevDZDay = solarLunar.getTerm(prevY, 24)
  if (prevDZDay > 0) candidates.push({ idx: 24, date: new Date(prevY, 11, prevDZDay) })
  for (let n = 2; n <= 24; n += 2) {
    const d = solarLunar.getTerm(year, n)
    if (d < 0) continue
    const m = Math.ceil(n / 2) - 1
    candidates.push({ idx: n, date: new Date(year, m, d) })
  }
  let current = candidates[0]
  for (const c of candidates) {
    if (c.date <= date) current = c
    else break
  }
  return current
}

function getYueJiang(year, month, day) {
  const zq = findZhongQi(year, month, day)
  const yj = ZHONG_QI_TO_YUE_JIANG[zq.idx] || '亥'
  return { zhi: yj, name: YUE_JIANG_NAMES[yj] || yj, zhongQi: zq }
}

function buildTianPan(yueJiangZhi, zhanShiZhiIdx) {
  const yjIdx = ZHI.indexOf(yueJiangZhi)
  const offset = (zhanShiZhiIdx - yjIdx + 12) % 12
  const tianPan = {}
  for (let i = 0; i < 12; i++) {
    const earthIdx = i
    const heavenIdx = (i - offset + 12) % 12
    tianPan[ZHI[earthIdx]] = ZHI[heavenIdx]
  }
  return tianPan
}

function getKeRelation(upperZhi, lowerZhi, dayGan) {
  const upperWx = ZHI_WU_XING[upperZhi]
  const lowerWx = ZHI_WU_XING[lowerZhi]
  if (WU_XING_KE[upperWx] === lowerWx) return '上克下'
  if (WU_XING_KE[lowerWx] === upperWx) return '下克上'
  return null
}

function calcSiKe(tianPan, dayGan, dayZhi) {
  const jiGong = GAN_JI_GONG[dayGan] || '寅'
  const ke1 = tianPan[jiGong]
  const ke2 = tianPan[ke1]
  const ke3 = tianPan[dayZhi]
  const ke4 = tianPan[ke3]
  return [
    { name: '一课', upper: ke1, lower: jiGong, desc: `${jiGong}上见${ke1}` },
    { name: '二课', upper: ke2, lower: ke1, desc: `${ke1}上见${ke2}` },
    { name: '三课', upper: ke3, lower: dayZhi, desc: `${dayZhi}上见${ke3}` },
    { name: '四课', upper: ke4, lower: ke3, desc: `${ke3}上见${ke4}` },
  ]
}

function calcSanChuan(keList, dayGan) {
  const keResults = keList.map(k => {
    const kr = getKeRelation(k.upper, k.lower, dayGan)
    return { ...k, ke: kr }
  })

  const shangKeXia = keResults.filter(k => k.ke === '上克下')
  const xiaKeShang = keResults.filter(k => k.ke === '下克上')

  let chuChuan = null
  if (shangKeXia.length > 0) {
    chuChuan = shangKeXia[0].upper
  } else if (xiaKeShang.length > 0) {
    chuChuan = xiaKeShang[0].upper
  } else {
    chuChuan = keResults[0].upper
  }

  return { keResults, chuChuan }
}

function calcZhongMoChuan(chuChuan, tianPan) {
  const zhongChuan = tianPan[chuChuan]
  const moChuan = tianPan[zhongChuan]
  return { chuChuan, zhongChuan, moChuan }
}

function placeTianJiang(hour, dayGan, tianPan) {
  const isDay = hour >= 5 && hour <= 17
  const guiRen = isDay ? GUI_REN_TABLE[dayGan].day : GUI_REN_TABLE[dayGan].night

  const guiRenTianPan = tianPan[guiRen]
  const guiRenIdx = ZHI.indexOf(guiRenTianPan)
  const isShun = guiRenIdx >= 0 && guiRenIdx <= 4

  const tianJiang = {}
  for (let i = 0; i < 12; i++) {
    const seqIdx = isShun ? (guiRenIdx + i) % 12 : (guiRenIdx - i + 12) % 12
    const zhi = ZHI[seqIdx]
    tianJiang[zhi] = TIAN_JIANG_ORDER[i]
  }

  return { tianJiang, guiRen: guiRenTianPan, isDay, isShun }
}

export function calculateLiuRen({ year, month, day, hour }) {
  const sl = solarLunar.solar2lunar(year, month, day)
  const gzDay = sl.gzDay
  const dayGZ = parseGanZhi(gzDay)
  const dayGan = dayGZ.gan
  const dayZhi = dayGZ.zhi

  const dayGanIdx = GAN.indexOf(dayGan)
  const hourGZStr = solarLunar.getShiChen(hour, dayGanIdx)
  const hourGZ = parseGanZhi(hourGZStr)
  const hourZhi = hourGZ.zhi
  const hourZhiIdx = ZHI.indexOf(hourZhi)

  const yueJiang = getYueJiang(year, month, day)
  const tianPan = buildTianPan(yueJiang.zhi, hourZhiIdx)

  const siKe = calcSiKe(tianPan, dayGan, dayZhi)
  const chuChuan = calcSanChuan(siKe, dayGan)
  const sanChuan = calcZhongMoChuan(chuChuan.chuChuan, tianPan)

  const tianJiangResult = placeTianJiang(hour, dayGan, tianPan)

  const diPan = {}
  for (let i = 0; i < 12; i++) {
    const zhi = ZHI[i]
    diPan[zhi] = {
      earth: zhi,
      heaven: tianPan[zhi],
      jiang: tianJiangResult.tianJiang[zhi] || '',
    }
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
    yueJiang: { zhi: yueJiang.zhi, name: yueJiang.name },
    zhanShi: hourZhi,
    diPan,
    siKe: chuChuan.keResults,
    sanChuan,
    tianJiang: tianJiangResult,
    dayGanJiGong: GAN_JI_GONG[dayGan],
  }
}
