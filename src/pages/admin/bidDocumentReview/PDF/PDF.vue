<template>
  <div class="controls">
    <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
  </div>

  <div class="pdf-container" @scroll="handleScroll">
    <div v-if="loading" class="loading-indicator">加载中...</div>
    <vue-pdf-embed
      v-else
      :source="source"
      :page="currentPage"
      @loaded="handleLoaded"
      @error="(err) => console.error('PDF渲染错误', err)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { createLoadingTask } from 'vue3-pdfjs'

const source = ref({ url: '/static/test.pdf' })
const currentPage = ref(1)
const totalPages = ref(0)
const loading = ref(true)
const lastScrollTop = ref(0)
const scrollThreshold = ref(100) // 滚动阈值（像素）

// PDF加载完成回调
const handleLoaded = (pdf) => {
  totalPages.value = pdf.numPages
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value || 1
  }
  loading.value = false
}

// 滚动翻页逻辑
const handleScroll = (e) => {
  const currentScrollTop = e.target.scrollTop
  const scrollDelta = currentScrollTop - lastScrollTop.value

  // 判断滚动方向
  if (Math.abs(scrollDelta) > scrollThreshold.value) {
    if (scrollDelta > 0 && currentPage.value < totalPages.value) {
      nextPage()
    } else if (scrollDelta < 0 && currentPage.value > 1) {
      prevPage()
    }
  }

  lastScrollTop.value = currentScrollTop
}

// 翻页控制
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// 备用加载方式
onMounted(() => {
  const task = createLoadingTask(source.value.url)
  task.promise
    .then((pdf) => {
      totalPages.value = pdf.numPages
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value || 1
      }
    })
    .catch(console.error)
    .finally(() => (loading.value = false))
})

// 键盘快捷键支持
const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') prevPage()
  if (e.key === 'ArrowRight') nextPage()
  if (e.key === 'ArrowUp') scrollToTop()
  if (e.key === 'ArrowDown') scrollToBottom()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// 辅助功能
const scrollToTop = () => {
  const container = document.querySelector('.pdf-container')
  container.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  const container = document.querySelector('.pdf-container')
  container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
}
</script>

<style scoped>
.controls {
  position: sticky;
  top: 0;
  background: white;
  padding: 10px 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pdf-container {
  height: calc(100vh - 230px); /* 留出控制栏高度 */
  overflow-y: auto;
  position: relative;
  border: 1px solid #eee;
  border-radius: 4px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #888;
}
</style>
