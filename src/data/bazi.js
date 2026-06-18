const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const SHI_CHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const SHI_CHEN_RANGE = [
  ['23:00–01:00', '子时'], ['01:00–03:00', '丑时'], ['03:00–05:00', '寅时'],
  ['05:00–07:00', '卯时'], ['07:00–09:00', '辰时'], ['09:00–11:00', '巳时'],
  ['11:00–13:00', '午时'], ['13:00–15:00', '未时'], ['15:00–17:00', '申时'],
  ['17:00–19:00', '酉时'], ['19:00–21:00', '戌时'], ['21:00–23:00', '亥时'],
]

const WU_HU_DUN = { 甲: '丙', 乙: '戊', 丙: '庚', 丁: '壬', 戊: '甲', 己: '丙', 庚: '戊', 辛: '庚', 壬: '壬', 癸: '甲' }

const WU_SHU_DUN = { 甲: '甲', 乙: '丙', 丙: '戊', 丁: '庚', 戊: '壬', 己: '甲', 庚: '丙', 辛: '戊', 壬: '庚', 癸: '壬' }

const NA_YIN = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂中金', '乙未': '砂中金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水',
}

const SHI_SHEN_MAP = {
  比肩: { sameGan: true, sameZhi: true },
  劫财: { sameGan: true, sameZhi: false },
  食神: { generate: '己', ke: '庚' },
  伤官: { generate: '戊', ke: '辛' },
  偏财: { ke: '戊', generated: '壬' },
  正财: { ke: '己', generated: '癸' },
  偏官: { ke: '甲', generated: '庚' },
  正官: { ke: '乙', generated: '辛' },
  偏印: { generate: '甲', ke: '丙' },
  正印: { generate: '乙', ke: '丁' },
}

function isLeap(y) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
}

function monthDays(m, y) {
  return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]
}

function getYearGZ(year) {
  return { gan: TIAN_GAN[(year - 4) % 10], zhi: DI_ZHI[(year - 4) % 12] }
}

function getMonthGZ(yearGan, month) {
  const startGan = WU_HU_DUN[yearGan]
  const startIdx = TIAN_GAN.indexOf(startGan)
  const monthIdx = (month + 1) % 12
  return { gan: TIAN_GAN[(startIdx + monthIdx) % 10], zhi: DI_ZHI[monthIdx] }
}

function getDayGZ(year, month, day) {
  let days = 0
  for (let y = 1900; y < year; y++) days += isLeap(y) ? 366 : 365
  for (let m = 1; m < month; m++) days += monthDays(m, year)
  days += day - 1
  const gzIdx = (days + 10) % 60
  return { gan: TIAN_GAN[gzIdx % 10], zhi: DI_ZHI[gzIdx % 12], index: gzIdx }
}

function getHourGZ(dayGan, hourIndex) {
  const startGan = WU_SHU_DUN[dayGan]
  const startIdx = TIAN_GAN.indexOf(startGan)
  return { gan: TIAN_GAN[(startIdx + hourIndex) % 10], zhi: DI_ZHI[hourIndex], hourIndex }
}

function getHourIndex(hour24) {
  if (hour24 >= 23 || hour24 < 1) return 0
  if (hour24 < 3) return 1
  if (hour24 < 5) return 2
  if (hour24 < 7) return 3
  if (hour24 < 9) return 4
  if (hour24 < 11) return 5
  if (hour24 < 13) return 6
  if (hour24 < 15) return 7
  if (hour24 < 17) return 8
  if (hour24 < 19) return 9
  if (hour24 < 21) return 10
  return 11
}

function getGanZhiWuXing(gan) {
  const map = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }
  return map[gan]
}

function getZhiWuXing(zhi) {
  const map = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' }
  return map[zhi]
}

function getZhiCangGan(zhi) {
  const map = {
    子: ['癸'], 丑: ['己', '癸', '辛'], 寅: ['甲', '丙', '戊'],
    卯: ['乙'], 辰: ['戊', '乙', '癸'], 巳: ['丙', '庚', '戊'],
    午: ['丁', '己'], 未: ['己', '丁', '乙'], 申: ['庚', '壬', '戊'],
    酉: ['辛'], 戌: ['戊', '辛', '丁'], 亥: ['壬', '甲'],
  }
  return map[zhi]
}

function getShiShen(dayGan, otherGan) {
  const relation = {
    比肩: { self: ['甲', '丙', '戊', '庚', '壬'], other: ['甲', '丙', '戊', '庚', '壬'] },
    劫财: { self: ['甲', '丙', '戊', '庚', '壬'], other: ['乙', '丁', '己', '辛', '癸'] },
    正印: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['癸', '壬', '乙', '甲', '丁', '丙', '己', '戊', '辛', '庚'] },
    偏印: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'] },
    伤官: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['丁', '丙', '己', '戊', '辛', '庚', '癸', '壬', '乙', '甲'] },
    食神: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'] },
    正官: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['辛', '庚', '癸', '壬', '乙', '甲', '丁', '丙', '己', '戊'] },
    偏官: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'] },
    正财: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['己', '戊', '辛', '庚', '癸', '壬', '乙', '甲', '丁', '丙'] },
    偏财: { self: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], other: ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'] },
  }
  for (const [name, mapping] of Object.entries(relation)) {
    for (let i = 0; i < 10; i++) {
      if (mapping.self[i] === dayGan && mapping.other[i] === otherGan) return name
    }
  }
  return ''
}

function getKongWang(zhi) {
  const map = {
    甲: ['申', '酉'], 乙: ['午', '未'], 丙: ['辰', '巳'], 丁: ['寅', '卯'],
    戊: ['子', '丑'], 己: ['戌', '亥'], 庚: ['申', '酉'], 辛: ['午', '未'],
    壬: ['辰', '巳'], 癸: ['寅', '卯'],
  }
  return map[zhi] || []
}

function getDaYun(monthGan, monthZhi, gender, yearGan, startYear) {
  const isYang = ['甲', '丙', '戊', '庚', '壬'].includes(yearGan)
  const isShun = (isYang && gender === '男') || (!isYang && gender === '女')

  const ganStart = TIAN_GAN.indexOf(monthGan)
  const zhiStart = DI_ZHI.indexOf(monthZhi)

  const yun = []
  for (let i = 0; i < 8; i++) {
    const offset = isShun ? (i + 1) : -(i + 1)
    const ganIdx = ((ganStart + offset) % 10 + 10) % 10
    const zhiIdx = ((zhiStart + offset) % 12 + 12) % 12
    const gan = TIAN_GAN[ganIdx]
    const zhi = DI_ZHI[zhiIdx]
    const ageStart = 1 + i * 10
    const yearStart = startYear + i * 10
    const yearEnd = yearStart + 9
    yun.push({ gan, zhi, ageStart, yearStart, yearEnd, name: gan + zhi })
  }
  return yun
}

function calcWuXingStat(pillars) {
  const stat = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
  for (const p of pillars) {
    const wg = getGanZhiWuXing(p.gan)
    const wz = getZhiWuXing(p.zhi)
    stat[wg] = (stat[wg] || 0) + 2
    stat[wz] = (stat[wz] || 0) + 1
    for (const cg of p.cangGan) {
      stat[getGanZhiWuXing(cg)] = (stat[getGanZhiWuXing(cg)] || 0) + 1
    }
  }
  return stat
}

export function calculateBazi({ year, month, day, hour, gender, location }) {
  const hourIdx = getHourIndex(hour)
  const yearGZ = getYearGZ(year)
  const monthGZ = getMonthGZ(yearGZ.gan, month - 1)
  const dayGZ = getDayGZ(year, month, day)
  const hourGZ = getHourGZ(dayGZ.gan, hourIdx)

  const pillars = [
    { name: '年柱', ...yearGZ, cangGan: getZhiCangGan(yearGZ.zhi) },
    { name: '月柱', ...monthGZ, cangGan: getZhiCangGan(monthGZ.zhi) },
    { name: '日柱', ...dayGZ, cangGan: getZhiCangGan(dayGZ.zhi) },
    { name: '时柱', ...hourGZ, cangGan: getZhiCangGan(hourGZ.zhi) },
  ]

  const shiShenRows = pillars.map(p => ({
    ...p,
    shiShen: getShiShen(dayGZ.gan, p.gan),
    ganWuXing: getGanZhiWuXing(p.gan),
    zhiWuXing: getZhiWuXing(p.zhi),
    naYin: NA_YIN[p.gan + p.zhi] || '',
  }))

  const wuXing = calcWuXingStat(shiShenRows)
  const daYun = getDaYun(monthGZ.gan, monthGZ.zhi, gender, yearGZ.gan, year + 1)

  const currentYear = 2026
  const currentAge = currentYear - year
  const currentDaYun = daYun.find(d => currentYear >= d.yearStart && currentYear <= d.yearEnd) || daYun[0]

  const liuNianGZ = getYearGZ(currentYear)

  return {
    birth: { year, month, day, hour, gender, location, hourIdx },
    shengXiao: SHENG_XIAO[(year - 4) % 12],
    dayGan: dayGZ.gan,
    pillars: shiShenRows,
    wuXing,
    daYun,
    currentDaYun,
    currentAge,
    liuNian: { year: currentYear, ...liuNianGZ, ganWuXing: getGanZhiWuXing(liuNianGZ.gan), zhiWuXing: getZhiWuXing(liuNianGZ.zhi) },
    hourDisplay: SHI_CHEN_RANGE[hourIdx][1],
  }
}
