# AGENTS.md

## Quick start

```bash
npm install        # install deps
npm run dev        # start dev server (Vite 8)
npm run build      # production build → dist/
npm run preview    # preview production build
```

## Architecture

- **Stack**: Vue 3 (Composition API, `<script setup>`) + Vite 8 + Element Plus 2.14 + Vue Router 4
- **No TypeScript** — plain JS only
- **No test/lint/typecheck tooling** — only `dev`, `build`, `preview` scripts exist
- **Entrypoint**: `src/main.js` — registers Element Plus + all its icons globally, mounts app
- **Router**: `src/router/index.js` — 6 routes:
  - `/` → Home.vue (Bazi input), `/reading` → Reading.vue, `/meihua` → MeiHuaYiShu.vue
  - `/qimen` → QiMen.vue, `/liuren` → DaLiuRen.vue, `/taiyi` → TaiYi.vue
- **Data engines**: `src/data/bazi.js`, `liuren.js`, `qimen.js`, `taiyi.js`
- **Components**: `src/components/` — BaziChart, DaYunTimeline, FiveElements, SectionCard, TheoryInfo
- **Stale file**: `src/components/HelloWorld.vue` — default Vite template, not imported anywhere

## Conventions

- Use `@` path alias (maps to `src/`, configured in `vite.config.js`)
- Element Plus icons are registered globally in `main.js` — use `<el-icon><IconName /></el-icon>` without imports
- Chinese (zh-CN) is the UI language throughout
- Recommended VSCode extension: `Vue.volar`

## Theme system

- 12 themes applied via `data-theme` attribute on `<html>`
- Source: `src/themes.css`, saved to `localStorage` key `astrology-theme`
- Default: `dark-contrast`

## Deployment

- Vercel with SPA rewrites (all routes → `/index.html`), configured in `vercel.json`
- Build command: `vite build`, output dir: `dist`
