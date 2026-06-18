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

## 📜 Data Sources

- **Bazi calculation** — Based on traditional Chinese calendrical algorithms (五虎遁, 五鼠遁, 日柱 formula)
- **Hexagram texts** — Derived from the *I Ching (Yi Jing / 易经)* and classical commentaries
- **Plum Blossom numbers** — Following the method of Shao Yong (邵雍)

## ⚠️ Disclaimer

This application is for **entertainment and educational purposes only**. All readings and predictions should not be used as a basis for important life decisions.

## 📄 License

[MIT License](LICENSE)

---

*Built with ❤️ using Vue 3 + Vite*
