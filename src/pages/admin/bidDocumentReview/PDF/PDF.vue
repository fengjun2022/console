
<template>
  <div class="pdf-container" ref="containerRef">
    <div v-if="loading" class="loading-indicator">加载中...</div>
    <div v-else class="pdf-pages-wrapper">
      <div
        v-for="p in totalPages"
        :key="p"
        class="pdf-page"
        :ref="(el) => setPageRef(p, el as HTMLElement)"
      >
        <vue-pdf-embed
          :source="source"
          :page="p"
          @rendered="onPageRendered"
          @error="onPageError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { createLoadingTask } from 'vue3-pdfjs'

const props = defineProps<{ url?: string | { url: string } }>()

const source = ref<{ url: string } | string>(props.url || { url: '/static/test.pdf' })
const totalPages = ref(0)
const loading = ref(true)
const pendingPage = ref<number | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const pageElMap = new Map<number, HTMLElement>()

// （连续滚动模式无需单页 loaded 回调）

function setPageRef(p: number, el?: HTMLElement) {
  if (!el) return
  pageElMap.set(p, el)
}

// 事件回调（可选）：避免未定义导致警告
function onPageRendered() {
  // no-op; 可按需记录渲染完成
}
function onPageError(err: unknown) {
  // 简单控制台输出，避免未定义告警
  // eslint-disable-next-line no-console
  console.warn('PDF page render error:', err)
}

// 暴露外部跳转页码方法
function goToPage(page: number) {
  if (!page || page < 1) page = 1
  if (!totalPages.value || loading.value) {
    pendingPage.value = page
    return
  }
  if (page > totalPages.value) page = totalPages.value
  const el = pageElMap.get(page)
  const container = containerRef.value
  if (el && container) {
    const top = el.offsetTop
    container.scrollTo({ top, behavior: 'smooth' })
  }
}

// 当传入的 url 变化时，重新加载 PDF
watch(
  () => props.url,
  (val) => {
    if (!val) return
    source.value = typeof val === 'string' ? { url: val } : val
    loading.value = true
    const task = createLoadingTask((source.value as any).url || source.value)
    task.promise
      .then((pdf) => {
        totalPages.value = pdf.numPages
      })
      .catch(console.error)
      .finally(async () => {
        loading.value = false
        await nextTick()
        if (pendingPage.value) {
          goToPage(pendingPage.value)
          pendingPage.value = null
        }
      })
  },
  { immediate: true }
)

// 键盘快捷键支持（仅上下滚动）
const handleKeydown = (e) => {
  if (e.key === 'ArrowUp') scrollToTop()
  if (e.key === 'ArrowDown') scrollToBottom()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// 辅助功能
const scrollToTop = () => {
  const container = containerRef.value
  if (!container) return
  container.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  const container = containerRef.value
  if (!container) return
  container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
}

defineExpose({ goToPage })
</script>

<style scoped>
.pdf-container {
  height: calc(100vh - 160px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
}

.pdf-page { margin-bottom: 8px; display: block; }
.pdf-page :deep(canvas) {
  width: 100% !important;
  height: auto !important;
  display: block;
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
