<template>
  <div class="app-container">
    <nav class="navbar">
      <router-link to="/" class="logo">
        <span class="logo-icon">☰</span>
        <span class="logo-text">紫微智算</span>
        <span class="logo-sub">AI 命理</span>
      </router-link>
      <div class="nav-center">
        <div class="nav-links">
          <router-link to="/" class="nav-link" active-class="nav-link-active">
            <el-icon><HomeFilled /></el-icon>
            <span>八字命理</span>
          </router-link>
          <router-link to="/meihua" class="nav-link" active-class="nav-link-active">
            <el-icon><MagicStick /></el-icon>
            <span>梅花易数</span>
          </router-link>
        </div>
      </div>
      <div class="nav-right">
        <div class="theme-switcher" ref="themeRef">
          <button class="theme-btn" @click="toggleThemeMenu">
            <el-icon><BrushFilled /></el-icon>
            <span class="theme-label">主题</span>
          </button>
          <transition name="dropdown">
            <div v-if="showThemeMenu" class="theme-menu">
              <button v-for="t in themes" :key="t.id"
                class="theme-option"
                :class="{ active: currentTheme === t.id }"
                @click="setTheme(t.id)">
                <span class="theme-dot" :style="{ background: t.color }" />
                <span>{{ t.label }}</span>
                <el-icon v-if="currentTheme === t.id"><Check /></el-icon>
              </button>
            </div>
          </transition>
        </div>
      </div>
      <div class="nav-glow" />
    </nav>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const themes = [
  { id: 'warm-dark', label: '暖色暗黑', color: '#c49a4a' },
  { id: 'cool-dark', label: '冷色暗黑', color: '#58a6ff' },
  { id: 'sepia', label: '羊皮纸', color: '#b8863e' },
  { id: 'light', label: '极简亮色', color: '#b8963e' },
]

const currentTheme = ref('warm-dark')
const showThemeMenu = ref(false)
const themeRef = ref(null)

function loadTheme() {
  const saved = localStorage.getItem('astrology-theme') || 'warm-dark'
  currentTheme.value = saved
  document.documentElement.setAttribute('data-theme', saved)
}

function setTheme(id) {
  currentTheme.value = id
  document.documentElement.setAttribute('data-theme', id)
  localStorage.setItem('astrology-theme', id)
  showThemeMenu.value = false
}

function toggleThemeMenu() {
  showThemeMenu.value = !showThemeMenu.value
}

function handleClickOutside(e) {
  if (themeRef.value && !themeRef.value.contains(e.target)) {
    showThemeMenu.value = false
  }
}

onMounted(() => {
  loadTheme()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-gold);
}

.nav-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
  position: relative;
}

.logo-icon {
  font-size: 22px;
  color: var(--gold);
}

.logo-text {
  font-family: var(--font-chinese);
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-sub {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 0.25s;
  font-family: var(--font-chinese);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--gold-dim);
}

.nav-link-active {
  color: var(--gold) !important;
  background: var(--gold-dim) !important;
}

.theme-switcher {
  position: relative;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-family: var(--font-chinese);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s;
}

.theme-btn:hover {
  color: var(--text-primary);
  background: var(--gold-dim);
  border-color: var(--gold);
}

.theme-label {
  font-size: 13px;
}

.theme-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 180px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  padding: 6px;
  box-shadow: var(--shadow-card);
  z-index: 100;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  font-family: var(--font-chinese);
  color: var(--text-primary);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.theme-option:hover {
  background: var(--gold-dim);
}

.theme-option.active {
  color: var(--gold);
  background: var(--gold-dim);
}

.theme-option .el-icon {
  margin-left: auto;
  font-size: 14px;
}

.theme-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid var(--border-gold);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.main-content {
  flex: 1;
  margin-top: 64px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 12px;
    gap: 4px;
  }
  .logo-sub {
    display: none;
  }
  .nav-center {
    position: static;
    transform: none;
  }
  .nav-link {
    padding: 8px 10px;
    font-size: 13px;
  }
  .nav-link span {
    display: none;
  }
  .theme-label {
    display: none;
  }
  .theme-btn {
    padding: 8px 10px;
  }
  .theme-menu {
    right: 0;
    left: auto;
    min-width: 160px;
  }
}
</style>
