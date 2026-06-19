<template>
  <div class="theory-info-float">
    <button class="theory-btn" @click="visible = true" :title="'查看' + title + '的理论依据'">
      <span class="theory-btn-icon">?</span>
    </button>
    <el-dialog v-model="visible" :title="title + ' — 理论依据'" width="640px" top="8vh"
      class="theory-dialog" destroy-on-close>
      <div class="theory-body">
        <div v-for="(section, i) in sections" :key="i" class="theory-section">
          <h3 class="theory-heading">{{ section.heading }}</h3>
          <p class="theory-text" v-for="(line, j) in section.lines" :key="j">{{ line }}</p>
        </div>
        <div class="theory-section" v-if="sources">
          <h3 class="theory-heading">主要参考文献</h3>
          <ul class="theory-sources">
            <li v-for="(src, i) in sources" :key="i">{{ src }}</li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: { type: String, required: true },
  sections: { type: Array, default: () => [] },
  sources: { type: Array, default: () => [] },
})

const visible = ref(false)
</script>

<style scoped>
.theory-info-float {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 999;
}

.theory-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--gold, #c49a4a);
  background: var(--bg-card, #1a1a2e);
  color: var(--gold, #c49a4a);
  font-size: 20px;
  font-weight: 700;
  font-family: serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.theory-btn:hover {
  background: var(--gold, #c49a4a);
  color: #fff;
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(196, 154, 74, 0.4);
}

.theory-btn-icon {
  line-height: 1;
}

.theory-body {
  font-family: var(--font-chinese, 'Noto Serif SC', serif);
  max-height: 60vh;
  overflow-y: auto;
  padding: 4px 0;
}

.theory-section {
  margin-bottom: 20px;
}

.theory-heading {
  font-size: 16px;
  font-weight: 700;
  color: var(--gold, #c49a4a);
  margin: 0 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-gold, rgba(196, 154, 74, 0.3));
}

.theory-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-primary, #e0e0e0);
  margin: 0 0 6px;
  text-align: justify;
}

.theory-sources {
  list-style: none;
  padding: 0;
  margin: 0;
}

.theory-sources li {
  position: relative;
  padding: 4px 0 4px 18px;
  font-size: 13px;
  color: var(--text-secondary, #999);
  line-height: 1.6;
}

.theory-sources li::before {
  content: '•';
  position: absolute;
  left: 4px;
  color: var(--gold, #c49a4a);
}

@media (max-width: 640px) {
  .theory-info-float {
    bottom: 16px;
    right: 16px;
  }
  .theory-btn {
    width: 38px;
    height: 38px;
    font-size: 17px;
  }
}
</style>
