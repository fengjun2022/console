<template>
  <div class="review-view-page">
    <n-card class="header-card" :bordered="false">
      <div class="toolbar">
        <n-button
          size="medium"
          @click="goBack"
          quaternary
          circle
        >
          <template #icon>
            <n-icon size="20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </n-icon>
          </template>
        </n-button>
        <div class="title-section">
          <h2 class="title">{{ rowData.tenderName || rowData.fileName }}</h2>
          <span class="subtitle">文档审查</span>
        </div>
      </div>
    </n-card>

    <div class="content-wrapper">
      <n-card class="pdf-card" :bordered="false">
        <PDFviewVue :pdf-url="rowData.fileUrl" :results="resultData || []" />
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NCard, NIcon, useMessage } from 'naive-ui'
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PDFviewVue from './PDF/index.vue'
import { getResult } from '@/api/tenderfiletask'

const route = useRoute()
const router = useRouter()

const rowData = computed<any>(() => {
  const raw = route.query.row
  if (!raw) return {}
  try {
    return JSON.parse(decodeURIComponent(String(raw)))
  } catch (e) {
    return {}
  }
})

const goBack = () => {
  router.push({ name: 'bidDocumentReview' })
}

const message = useMessage()
const resultData = ref<any>(null)
const loading = ref(false)

const fetchResult = async (docId?: string) => {
  if (!docId) return
  try {
    loading.value = true
    const res = await getResult<any>({ docId })
    resultData.value = res?.data ?? null
  } catch (e: any) {
    message.error(e?.message || '获取结果失败')
  } finally {
    loading.value = false
  }
}

watch(
  () => rowData.value?.docId,
  (docId) => fetchResult(docId),
  { immediate: true }
)
</script>

<style scoped>
.review-view-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.header-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: white;
}

.header-card :deep(.n-card__content) {
  padding: 16px 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar .n-button {
  transition: all 0.3s ease;
}

.toolbar .n-button:hover {
  background: rgba(24, 160, 88, 0.1);
  color: #18a058;
}

.title-section {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  padding: 2px 12px;
  background: linear-gradient(135deg, #e8f4f8 0%, #d4e9f0 100%);
  border-radius: 12px;
  font-weight: 500;
}

.content-wrapper {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;

}

.pdf-card {
  flex: 1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: white;
  overflow: hidden;

  display: flex;
  flex-direction: column;
}

.pdf-card :deep(.n-card__content) {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .review-view-page {
    padding: 12px;
    gap: 12px;
  }

  .header-card :deep(.n-card__content) {
    padding: 12px 16px;
  }

  .title {
    font-size: 16px;
  }

  .subtitle {
    font-size: 12px;
    padding: 2px 8px;
  }
}

/* 加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-card,
.pdf-card {
  animation: fadeIn 0.4s ease-out;
}

.pdf-card {
  animation-delay: 0.1s;
}
</style>
