# AI Astrology · Bazi & Plum Blossom Divination

A modern web application that blends **traditional Chinese metaphysics** with **artificial intelligence**. Built with Vue 3, Element Plus, and a warm earth-tone design system.

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.9-409EFF?logo=element)](https://element-plus.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## ✨ Features

### 🔮 Bazi (Four Pillars of Destiny)
- **Accurate Calculation** — Computes the Four Pillars (Year, Month, Day, Hour), Heavenly Stems, Earthly Branches, Hidden Stems, and Na Yin
- **Five Elements Analysis** — Quantified五行 (Wu Xing) distribution with ring charts and balance assessment
- **Da Yun (Great Fortune) Timeline** — Visual 10-year cycles with current fortune highlight
- **Annual Forecast** — Current year (Liu Nian) analysis with heavenly stems and earthly branches
- **Lunar Calendar Support** — Enter dates in either solar or lunar calendar; automatic conversion via `solarlunar`
- **Comprehensive Reading** — Includes career direction, name suggestion, relationship timing, and partner compatibility

### ☯️ Plum Blossom Divination (梅花易数)
- **Number-based Divination** — Input any 3 numbers to generate a hexagram
- **Complete Hexagram Display** — Visual 6-line (爻) diagram with moving Yao marking
- **64 Hexagrams Database** — Full judgment (卦辞), commentary (彖传), and image (大象) for all 64 hexagrams
- **Moving Yao Interpretation** — Click on the moving line for detailed guidance
- **Quick Presets** — One-click presets for love, career, wealth, and daily fortune

### 🎨 Design
- **4 Built-in Themes** — Warm Dark (default), Cool Dark, Sepia (parchment), Light
- **Earth-tone Color Palette** — Low-saturation, warm-toned colors for comfortable reading
- **Glassmorphism Cards** — Frosted glass effect with golden borders
- **Responsive** — Fully adaptive to mobile, tablet, and desktop
- **Chinese Classical Aesthetics** — Noto Serif SC font, subtle grid patterns, gold accents

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/zhouqi-7/astrology-ai-pro.git
cd astrology-ai-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Vue 3](https://vuejs.org/) (Composition API) |
| Build Tool | [Vite 8](https://vite.dev/) |
| UI Library | [Element Plus 2.9](https://element-plus.org/) |
| Router | [Vue Router 4](https://router.vuejs.org/) |
| Calendar | [solarlunar](https://www.npmjs.com/package/solarlunar) (lunar ⇄ solar) |
| Fonts | [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC), [Inter](https://fonts.google.com/specimen/Inter) |

## 📁 Project Structure

```
src/
├── data/
│   └── bazi.js              # Bazi calculation engine
├── router/
│   └── index.js             # Vue Router configuration
├── views/
│   ├── Home.vue             # Birth info input page
│   ├── Reading.vue          # Full Bazi reading report
│   └── MeiHuaYiShu.vue      # Plum Blossom divination page
├── components/
│   ├── BaziChart.vue        # Four Pillars chart
│   ├── FiveElements.vue     # Wu Xing ring chart
│   ├── DaYunTimeline.vue    # Fortune timeline
│   └── SectionCard.vue      # Reusable section card
├── style.css                # Global styles
├── themes.css               # 4-color theme system
├── App.vue                  # App shell with nav + theme switcher
└── main.js                  # Entry point
```

## 🎨 Themes

| Theme | Preview | Description |
|-------|---------|-------------|
| 🌙 **Warm Dark** | Default | Warm charcoal + muted gold + sage teal |
| 🌌 **Cool Dark** | Switchable | GitHub-style dark + cyan accents |
| 📜 **Sepia** | Switchable | Cream paper + dark brown + bronze |
| ☀️ **Light** | Switchable | Clean white + gold accents |

Themes persist in `localStorage` and apply instantly via CSS custom properties.

## 🧭 Roadmap / 后续规划

The project plans to expand into a **comprehensive Chinese metaphysics platform** covering the following modules:

### 📖 Lu Ban's Book (鲁班书 / 鲁班经)
> *Lu Ban Jing — The classic of Chinese carpentry, architecture, and talismanic arts.*

Traditional craftsmen's manual attributed to Lu Ban (鲁班), the patron saint of Chinese builders. Content includes:
- **Lu Ban Ruler** (鲁班尺) — Auspicious measurements for doors, windows, furniture with 8-color fortune markings (财/病/离/义/官/劫/害/吉)
- **House Building Taboos** (营造禁忌) — Site selection, orientation, groundbreaking rituals, and beam-raising ceremonies
- **Architectural Talismans** (镇宅符) — Protective charms to ward off evil spirits and harmonize dwelling energies
- **Practical Spells** (实用符咒) — Traditional methods for stopping bleeding, removing fish bones, and curing common ailments
- **"Loss of One Faculty" Legend** (缺一门) — The myth that practitioners of Lu Ban's magical arts must suffer a personal sacrifice

### ✍️ Name Selection (起名 / 取名)
> *Based on Bazi (八字)五行 analysis and Five Elements balance.*

- **Five Elements Deficiency Analysis** (五行补缺) — Analyze the Wu Xing distribution in one's Bazi and recommend characters that supply missing elements
- **Best Character Recommendation** (荐字) — Suggest Chinese characters ranked by element compatibility, stroke count auspiciousness, and phonetic harmony
- **Da Yun Alignment** (大运配合) — Select names that align with current and upcoming 10-year fortune cycles
- **Family Lineage Consideration** (辈分/家谱) — Respect generation names and family tree ordering
- **Western Name Companion** (英文名搭配) — Suggest phonetically compatible English names

### 🕐 Auspicious Timing (择吉 / 黄历)
> *Chinese calendar-based lucky date/time selection.*

- **Daily Auspiciousness** (每日宜忌) — Display what activities are recommended or discouraged for each day based on the Almanac (通书)
- **Event-Based Selection** (事项择吉) — Find the best dates for wedding (嫁娶), moving (搬家), business opening (开业), travel (出行), construction (动土), burial (安葬)
- **Hour Selection** (吉时) — Determine the most favorable 2-hour window within a day for specific activities
- **Conflict Avoidance** (冲煞) — Identify zodiac animal conflicts and directional taboos for a given date
- **Solar Term Integration** (节气) — Align with the 24 solar terms for agricultural and health-related timing

### 🔮 Additional Modules / 其他模块

| Module | Description |
|--------|-------------|
| **Face Reading** (面相) | Facial feature analysis based on traditional Chinese physiognomy |
| **Palmistry** (手相) | Palm line interpretation integrated with Bazi elements |
| **Zi Wei Dou Shu** (紫微斗数) | Complex star-based destiny analysis (advanced) |
| **Qi Men Dun Jia** (奇门遁甲) | Strategic divination for business and life decisions |
| **Dream Interpretation** (解梦) | Traditional Chinese dream symbolism and omens |
| **I Ching Coin Divination** (金钱卦) | Classical 3-coin yarrow stalk divination method |

> *These modules are under consideration for future development. Community contributions and suggestions are welcome!*

- **Bazi calculation** — Based on traditional Chinese calendrical algorithms (五虎遁, 五鼠遁, 日柱 formula)
- **Hexagram texts** — Derived from the *I Ching (Yi Jing / 易经)* and classical commentaries
- **Plum Blossom numbers** — Following the method of Shao Yong (邵雍)

## ⚠️ Disclaimer

This application is for **entertainment and educational purposes only**. All readings and predictions should not be used as a basis for important life decisions.

## 📄 License

[MIT License](LICENSE)

---

*Built with ❤️ using Vue 3 + Vite*
