<template>
  <button @click="prevPage">上一页</button>
  <button @click="nextPage">下一页</button>
  <div class="pdf-container" @scroll="handleScroll">
    <!-- 新增滚动容器 -->
    <div v-if="loading">加载中...</div>
    <vue-pdf-embed v-else :source="source" :page="currentPage" @loaded="handleLoaded" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { createLoadingTask } from 'vue3-pdfjs'

const source = ref({ url: '/static/印客2024Web前端大厂训练营.pdf' })
const currentPage = ref(1)
const totalPages = ref(0)
const loading = ref(true)

const handleLoaded = (pdf) => {
  console.log('loading------------')
  totalPages.value = pdf.numPages
  loading.value = false
}
const prevPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++

// 备用加载方式
onMounted(() => {
  const task = createLoadingTask(source.value.url)
  task.promise.then((pdf) => {
    totalPages.value = pdf.numPages
    loading.value = false
  })
})
</script>
<style scoped>
.pdf-container {
  height: 100vh; /* 固定容器高度 */
  overflow-y: auto; /* 启用垂直滚动 */
  position: relative; /* 避免定位冲突 */
}
</style>
