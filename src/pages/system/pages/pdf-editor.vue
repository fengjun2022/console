<template>
  <div class="pdf-editor-page" :style=" {backgroundColor: themeColors.main}" :class="{ 'dark-theme': globalStore.isDarkMode }">


    <div class="editor-container">
      <PdfToMdEditor />
    </div>
  </div>
</template>

<script setup lang="ts">
import PdfToMdEditor from '@/components/PdfToMdEditor.vue'
import { useGlobalStore } from '@/stores/global-store'
import { computed } from 'vue'
import { getThemeColors } from '@/config/theme'
import { storeToRefs } from 'pinia'
const globalStore = useGlobalStore()
const { isSidebarMinimized, isHeaderVisible, isDarkMode,userDropdownOptions } = storeToRefs(globalStore)

const themeColors = computed(() => {
  return getThemeColors(isDarkMode.value ? 'dark' : 'light')
})

</script>

<style scoped>
.pdf-editor-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}





.dark-theme .page-header {
  border-bottom-color: rgba(75, 85, 99, 0.5);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.dark-theme .page-title {
  color: #f9fafb;
}

.page-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.dark-theme .page-description {
  color: #d1d5db;
}

.editor-container {
  flex: 1;
  overflow: hidden;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #ffffff;
  min-height: 0;
  transition: all 0.3s ease;
}

.dark-theme .editor-container {
  background: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pdf-editor-page {
    margin: 8px;
    padding: 16px;
    min-height: calc(100vh - 32px);
    max-height: calc(100vh - 32px);
  }

  .page-header {
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 1.25rem;
  }
}
</style>
