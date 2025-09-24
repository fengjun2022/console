<template>
  <div class="pdf-to-md-editor" :class="{ 'dark-mode': globalStore.isDarkMode }">
    <n-layout has-sider class="h-full">
      <!-- 左侧：PDF 上传 / 预览 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="50"
        :width="sidebarWidth"
        :collapsed="sidebarCollapsed"
        class="pdf-upload-section"
        @collapse="sidebarCollapsed = true"
        @expand="sidebarCollapsed = false"
      >
        <!-- 收起时的展开按钮 -->
        <div v-if="sidebarCollapsed" class="collapsed-sidebar">
          <n-button quaternary size="small" @click="expandSidebar" class="expand-btn">
            <template #icon
              ><n-icon><ChevronForwardOutline /></n-icon
            ></template>
          </n-button>
        </div>

        <!-- 展开时内容 -->
        <div v-else class="sidebar-content">
          <!-- 上传模式 -->
          <div v-if="!hasPdf" class="upload-mode">
            <div class="section-header">
              <div class="flex items-center">
                <n-icon size="18" class="mr-2"><DocumentTextOutline /></n-icon>
                <h3 class="section-title-sm">PDF/图片 文件上传</h3>
              </div>
            </div>

            <div class="upload-area">
              <n-upload
                class="no-border-upload"
                v-model:file-list="fileList"
                :max="1"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                :custom-request="handleUpload"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <n-upload-dragger>
                  <div class="upload-content">
                    <n-icon size="48" :depth="3"><CloudUploadOutline /></n-icon>
                    <n-text class="upload-text">点击或拖拽文件到此上传</n-text>
                    <n-p depth="3" class="upload-description"> 支持 PDF 和图片文件（JPG, PNG, GIF, BMP, WEBP），将在此处直接预览 </n-p>
                  </div>
                </n-upload-dragger>
              </n-upload>
            </div>

            <div v-if="uploadStatus" class="status-section">
              <n-alert :type="uploadStatus.type" :title="uploadStatus.title">
                <div class="status-message">{{ uploadStatus.message }}</div>
              </n-alert>
            </div>
          </div>

          <!-- 预览模式 -->
          <!-- ======= TEMPLATE：预览模式（整段可直接替换） ======= -->
          <div v-else class="preview-mode">
            <div class="section-header">
              <div class="header-row">
                <!-- 左侧：标题 -->
                <div class="left">
                  <h3 class="section-title-sm">预览</h3>
                </div>

                <!-- 右侧：一排控制按钮 -->
                <div class="right controls-text">
                  <!-- 文件切换下拉 -->
                  <n-dropdown
                    v-if="hasPdf && uploadedFileUrls.length > 0"
                    :options="fileUrlOptions"
                    @select="handleFileSelect"
                    trigger="click"
                    placement="bottom-start"
                  >
                    <n-button  size="tiny" class="md-header-btn file-switch-btn  file-switch-btn" quaternary>
                      <span class="file-name-ellipsis">{{ currentFileName }}</span>
                      <template #icon>
                        <n-icon><ChevronForwardOutline /></n-icon>
                      </template>
                    </n-button>
                  </n-dropdown>

                  <!-- 智能解析 -->
                  <n-button

                    size="tiny"
                    @click="smartParse"
                    :loading="parsing"
                    class="text-btn primary-accent"
                    quaternary
                  >
                    智能解析
                  </n-button>

                  <!-- 重新上传 -->
                  <n-button text size="tiny" @click="reupload" class="text-btn" >
                    重新上传
                  </n-button>

                  <!-- 单页模式 -->
                  <n-button
                    text
                    size="tiny"
                    @click="toggleSinglePage"
                    class="text-btn"
                    :class="{ active: singlePageMode }"

                  >
                    单页模式
                  </n-button>

                  <!-- 缩放 -->
                  <div class="zoom-text-controls">
                    <n-button text size="tiny" @click="zoomOut" :disabled="zoomLevel <= 50" class="zoom-btn" >
                      −
                    </n-button>
                    <span class="zoom-display">{{ zoomLevel }}%</span>
                    <n-button text size="tiny" @click="zoomIn" :disabled="zoomLevel >= 200" class="zoom-btn" >
                      +
                    </n-button>
                  </div>

                  <!-- 收起 -->
                  <n-button text size="tiny" @click="collapseSidebar" class="text-btn" >
                    收起
                  </n-button>

                  <!-- 关闭 -->
                  <n-button text size="tiny" @click="closePdf" class="text-btn close-text" >
                    关闭
                  </n-button>
                </div>
              </div>
            </div>

            <!-- 下面是你的 PDF 预览内容，保持不变 -->
            <div class="pdf-info">
              <div class="pdf-preview pdf-preview-large">
                <iframe
                  v-if="pdfViewerSrc"
                  class="pdf-iframe"
                  :src="pdfUrlWithZoom"
                  :style="iframeStyle"
                  frameborder="0"
                  title="PDF预览"
                  allow="clipboard-read; clipboard-write"
                  referrerpolicy="no-referrer"
                />
                <div v-else class="preview-placeholder">
                  <p class="preview-text">PDF 预览</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-layout-sider>

      <!-- 右侧：Markdown 编辑器 -->
      <n-layout-content class="md-editor-section">
        <!-- MD头部操作栏 -->
        <div class="md-header-toolbar">
          <div class="md-header-left">
            <h3 class="md-title">Markdown 内容</h3>
          </div>
          <div class="md-header-right">
            <!-- 文件切换下拉框 - 仅在有多个文件时显示 -->


            <n-button text size="small" @click="toggleEditMode" class="md-header-btn" :class="{ active: isEditing }">
              {{ isEditing ? '预览' : '编辑' }}
            </n-button>

            <div class="divider"></div>
            <n-button text size="small" @click="handelAll" class="md-header-btn"> 全部 </n-button>
            <n-button text size="small" @click="handleGrammar" class="md-header-btn"> 语法 </n-button>
            <n-button text size="small" @click="handleVocabulary" class="md-header-btn"> 单词 </n-button>
            <n-button text size="small" @click="handleText" class="md-header-btn"> 课文 </n-button>
            <n-button text size="small" @click="handleExercise" class="md-header-btn"> 练习 </n-button>
          </div>
        </div>

        <div class="editor-container-inner">
          <div class="editor-wrapper">
            <MdEditor
              ref="editorRef"
              v-model="mdContent"
              :preview="isEditing"
              :toolbars="isEditing ? toolbars : [] as any"
              :theme="theme"
              language="zh-CN"
            />
          </div>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NUpload,
  NUploadDragger,
  NButton,
  NIcon,
  NText,
  NP,
  NAlert,
  NDropdown,
  NSpin,
  useMessage,
  type UploadFileInfo,
  type UploadCustomRequestOptions,
} from 'naive-ui'
import { CloudUploadOutline, DocumentTextOutline, DocumentOutline, ChevronForwardOutline } from '@vicons/ionicons5'
import { ExposeParam, MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { uploadBookFile } from '@/api'

const globalStore = useGlobalStore()
const { isDarkMode } = storeToRefs(globalStore)

const fileList = ref<UploadFileInfo[]>([])
const currentFile = ref<File | null>(null)
const currentPdfUrl = ref('')
const uploadedFileUrls = ref<Array<{url: string, name: string}>>([])
const selectedUrlIndex = ref(0)

const mdContent = ref(`# 欢迎\n\n点击上面的功能按钮来切换内容`)

const parsing = ref(false)
const singlePageMode = ref(false)
const zoomLevel = ref(100)
const sidebarCollapsed = ref(false)
const sidebarWidth = ref(600)
const isEditing = ref(false)
const isLoading = ref(false)
const hasError = ref(false)

const editorRef = ref<any>()

onMounted(() => {
  editorRef.value?.togglePreviewOnly(true)
})

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  editorRef.value?.togglePreviewOnly(!isEditing.value)
}

const message = useMessage()
const theme = computed(() => (globalStore.isDarkMode ? 'dark' : 'light'))
const toolbars = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog',
]

/** 有 PDF 吗（上传 or URL） */
const hasPdf = computed(() => uploadedFileUrls.value.length > 0 || !!currentPdfUrl.value)

/** 统一拿 iframe 的 src（支持 blob: 和 http(s):） */
const pdfViewerSrc = computed(() => {
  // 使用选中的URL
  if (uploadedFileUrls.value.length > 0 && selectedUrlIndex.value < uploadedFileUrls.value.length) {
    return uploadedFileUrls.value[selectedUrlIndex.value].url
  }
  // 兼容旧的逻辑
  if (currentPdfUrl.value) return currentPdfUrl.value
  return ''
})

/** 带参数的PDF URL */
const pdfUrlWithZoom = computed(() => {
  if (!pdfViewerSrc.value) return ''

  let url = pdfViewerSrc.value
  let params = []

  // 基本PDF查看器参数 - 隐藏工具栏以获得更大显示区域
  params.push('toolbar=0')
  params.push('navpanes=0')
  params.push('scrollbar=1')

  // 单页模式参数 - 更有效的全屏显示
  if (singlePageMode.value) {
    params.push('view=FitH')
    params.push('pagemode=none')
    params.push('scrollbar=0')
  } else {
    params.push('view=FitV')
  }

  // 添加缩放参数，尝试在PDF查看器级别控制缩放
  const zoomParam = Math.round((zoomLevel.value / 100) * 100)
  params.push(`zoom=${zoomParam}`)

  return params.length > 0 ? `${url}#${params.join('&')}` : url
})

/** CSS样式 - 简化iframe样式，主要依赖PDF查看器参数 */
const iframeStyle = computed(() => ({
  width: '100%',
  height: '100%',
  transform: singlePageMode.value ? 'none' : `scale(${zoomLevel.value / 100})`,
  transformOrigin: 'center top',
}))

/** 文件类型验证 */
const beforeUpload = (data: { file: File }) => {
  const { file } = data
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp'
  ]

  // 检查文件类型
  if (!allowedTypes.includes(file.type)) {
    message.error('只允许上传 PDF 和图片文件（JPG、PNG、GIF、BMP、WEBP）')
    return false
  }

  // 检查文件大小（限制为50MB）
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    message.error('文件大小不能超过 50MB')
    return false
  }

  return true
}

/** 上传文件 */
const uploadStatus = ref<{ type: 'success' | 'warning' | 'error' | 'info'; title: string; message: string } | null>(
  null,
)

const handleUpload = async ({ file }: UploadCustomRequestOptions) => {
  uploadStatus.value = { type: 'info', title: '上传中', message: '正在上传文件...' }

  try {
    const res = await uploadBookFile<any>(file.file as File)

    if (res.code === 200) {
      currentFile.value = file.file as File
      currentPdfUrl.value = '' // 清空 URL 模式
      // 添加新的文件URL到数组
      uploadedFileUrls.value.push({
        url: res.data,
        name: file.name || `文件${uploadedFileUrls.value.length + 1}`
      })
      // 选中最新上传的文件
      selectedUrlIndex.value = uploadedFileUrls.value.length - 1
      uploadStatus.value = {
        type: 'success',
        title: '上传成功',
        message: `文件 "${file.name}" 已上传到服务器`
      }
      message.success('文件上传成功')
    } else {
      uploadStatus.value = {
        type: 'error',
        title: '上传失败',
        message: res.msg || '上传失败，请重试'
      }
      message.error(res.msg || '上传失败')
    }
  } catch (error) {
    uploadStatus.value = {
      type: 'error',
      title: '上传失败',
      message: '网络错误，请检查网络连接后重试'
    }
    message.error('网络错误，上传失败')
  }

  setTimeout(() => (uploadStatus.value = null), 3000)
}

/** 智能解析（示例占位） */
const smartParse = async () => {
  if (!hasPdf.value) return
  parsing.value = true
  try {
    await new Promise((r) => setTimeout(r, 1200))
    mdContent.value = `# 智能解析结果\n\n- 这里填你的真实解析结果\n\n*${new Date().toLocaleString()}*`
    message.success('解析完成')
  } catch {
    message.error('解析失败')
  } finally {
    parsing.value = false
  }
}

/** 文件选择选项 */
const fileUrlOptions = computed(() =>
  uploadedFileUrls.value.map((file, index) => ({
    label: file.name,
    key: index.toString()
  }))
)

/** 当前文件名 */
const currentFileName = computed(() => {
  if (uploadedFileUrls.value.length > 0 && selectedUrlIndex.value < uploadedFileUrls.value.length) {
    return uploadedFileUrls.value[selectedUrlIndex.value].name
  }
  return '文件选择'
})

/** 切换文件 */
const handleFileSelect = (key: string) => {
  const index = parseInt(key)
  if (index >= 0 && index < uploadedFileUrls.value.length) {
    selectedUrlIndex.value = index
    message.info(`已切换到文件: ${uploadedFileUrls.value[index].name}`)
  }
}

/** 视图控制 */
const toggleSinglePage = () => {
  singlePageMode.value = !singlePageMode.value
  message.info(`${singlePageMode.value ? '已启用' : '已关闭'}单页模式`)
}
const zoomIn = () => {
  if (zoomLevel.value < 200) zoomLevel.value += 25
}
const zoomOut = () => {
  if (zoomLevel.value > 50) zoomLevel.value -= 25
}

/** 侧栏/关闭 */
const expandSidebar = () => (sidebarCollapsed.value = false)
const collapseSidebar = () => (sidebarCollapsed.value = true)
const reupload = () => closePdf()
const closePdf = () => {
  // 释放 blob
  if (currentFile.value) {
    try {
      URL.revokeObjectURL(URL.createObjectURL(currentFile.value))
    } catch {}
  }
  currentFile.value = null
  currentPdfUrl.value = ''
  uploadedFileUrls.value = [] // 清空文件URL数组
  selectedUrlIndex.value = 0 // 重置选中索引
  fileList.value = []
  zoomLevel.value = 100
  singlePageMode.value = false
  sidebarCollapsed.value = false
  message.info('已清空当前 PDF')
}

const handelAll = () => {
  mdContent.value = `# 语法讲解\n
1. 主语 + 谓语 + 宾语
2. 助词使用示例 …
# 单词表\n
- こんにちは：你好
- ありがとう：谢谢
`
}

const handleGrammar = () => {
  mdContent.value = `# 语法讲解\n
1. 主语 + 谓语 + 宾语
2. 助词使用示例 …`
}

const handleVocabulary = () => {
  mdContent.value = `# 单词表\n
- こんにちは：你好
- ありがとう：谢谢`
}

const handleText = () => {
  mdContent.value = `# 课文\n
> これはペンです。`
}

const handleExercise = () => {
  mdContent.value = `# 练习题\n
1. 用「これは〜です」造句
2. 翻译：谢谢`
}
/** MdEditor 事件 */
const handleSave = (value: string) => {
  message.success('内容已保存')
  console.log('保存的内容:', value)
}
const handleUploadImg = async (files: File[]): Promise<string[]> => files.map((f) => URL.createObjectURL(f))
</script>

<style scoped>
@import url('../scss/main.scss');

.pdf-to-md-editor {
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}
.pdf-to-md-editor.dark-mode {
  background-color: #2a2a29;
}

/* 侧边栏 */
.pdf-upload-section {
  border-right: 1px solid #e5e7eb;
  position: relative;
}
.collapsed-sidebar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
}
.expand-btn {
  writing-mode: vertical-lr;
  height: auto;
}
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
  overflow: hidden;
}

/* 标题更小 */
.section-title-sm {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

/* 上传模式 */
.upload-mode {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.section-header {
  padding: 6px 10px;
  border-bottom: 1px solid var(--border-color, #2b2b2b);
}

/* 顶部行：左右两边 */
.section-header .header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* 左侧标题更小且不换行 */
.section-header .left .section-title-sm {
  font-size: 12px;              /* 让“预览”变小 */
  font-weight: 600;
  margin: 0;
  white-space: nowrap;          /* 不换行 */
}

/* 右侧工具区：单行，不允许换行；允许内容缩进 */
.section-header .right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;                 /* 关键：允许子项做省略而不是把自己撑开 */
  flex-wrap: nowrap;            /* 不换行 */
  overflow: hidden;             /* 防止超出 */
}

/* 文件切换按钮：限制宽度，并让内部文字省略 */
.section-header .file-switch-btn {
  max-width: 28ch;              /* 你也可以写 200px / 20vw */
  flex: 0 1 auto;
}

/* 真正控制文件名省略的 span */
.section-header .file-name-ellipsis {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

/* 文本类按钮收紧内边距，避免占位过大 */
.section-header .text-btn,
.section-header .zoom-btn,
.section-header .n-button.text,
.section-header .n-button.quaternary {
  padding-left: 6px !important;
  padding-right: 6px !important;
}

/* 缩放展示固定宽度，避免抖动 */
.section-header .zoom-text-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
}
.section-header .zoom-text-controls .zoom-display {
  display: inline-block;
  width: 42px;                  /* “100%”宽度刚好放下 */
  text-align: center;
  white-space: nowrap;
}

/* 在特别窄的情况下，右侧允许横向滚动而不换行（可选） */
@media (max-width: 1024px) {
  .section-header .right {
    overflow-x: auto;
    overscroll-behavior-inline: contain;
  }
}
.no-border-upload {
  border: none !important;         /* 去掉边框 */
  outline: none !important;        /* 去掉可能的外框 */
  box-shadow: none !important;     /* 去掉阴影 */
}
.no-border-upload .n-upload-trigger {
  border: none !important;
}

.upload-area {
  margin-bottom: 16px;
}
.upload-content {
  text-align: center;
  padding: 20px;
}
.upload-text {
  display: block;
  margin: 12px 0 6px 0;
  font-size: 15px;
  font-weight: 500;
}
.upload-description {
  margin: 6px 0 0 0;
  font-size: 13px;
  line-height: 1.5;
}

.status-section {
  margin-top: 12px;
}
.status-message {
  line-height: 1.5;
}

/* 预览模式 */
.preview-mode {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.header-row .left {
  display: flex;
  align-items: center;
}

/* 文字按钮样式 */
.controls-text {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.text-btn {
  font-size: 11px;
  color: #666;
  padding: 2px 6px !important;
  border-radius: 4px !important;
  transition: all 0.2s ease;
}

.text-btn:hover {
  color: #1890ff !important;
  background-color: rgba(24, 144, 255, 0.1) !important;
}

.text-btn.active {
  color: #1890ff !important;
  background-color: rgba(24, 144, 255, 0.15) !important;
}

.close-text {
  color: #ff4d4f !important;
}

.close-text:hover {
  color: #ff4d4f !important;
  background-color: rgba(255, 77, 79, 0.1) !important;
}

.zoom-text-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.zoom-btn {
  font-size: 12px !important;
  color: #666 !important;
  padding: 1px 6px !important;
  border-radius: 3px !important;
  min-width: 20px;
}

.zoom-btn:hover {
  color: #1890ff !important;
  background-color: rgba(24, 144, 255, 0.1) !important;
}

.zoom-display {
  font-size: 10px;
  color: #999;
  min-width: 35px;
  text-align: center;
}

.pdf-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 4px 0;
}
.pdf-preview {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: #f8f9fa;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 2px;
  min-height: 400px;
  overflow: hidden;
}
.pdf-preview-large {
  padding: 2px;
  height: 100%;
}

/* PDF iframe样式 - 合适的显示尺寸 */
.pdf-iframe {
  width: 100%;
  height: 100%;
  min-height: 450px;
  border: none;
  border-radius: 4px;
  display: block;
  background: #fff;
}

.preview-placeholder {
  text-align: center;
  margin: auto;
}
.preview-text {
  margin: 12px 0;
  color: #666;
  font-size: 12px;
}

/* 右侧编辑器（全宽全高） */
.md-editor-section {
  overflow: hidden;
  position: relative;
  padding: 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* MD头部工具栏 */
.md-header-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.md-header-left {
  display: flex;
  align-items: center;
}

.md-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.md-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.md-header-btn {
  font-size: 13px !important;
  color: #666 !important;
  padding: 6px 12px !important;
  border-radius: 6px !important;
  transition: all 0.2s ease;
  font-weight: 500;
}

.md-header-btn:hover {
  color: #1890ff !important;
  background-color: rgba(24, 144, 255, 0.08) !important;
}

.md-header-btn.active {
  color: #1890ff !important;
  background-color: rgba(24, 144, 255, 0.12) !important;
  font-weight: 600;
}

.divider {
  width: 1px;
  height: 16px;
  background: #e5e7eb;
  margin: 0 4px;
}

/* md-editor 基础覆盖 */
:deep(.md-editor) {
  height: 100% !important;
  border-radius: 0;
}
:deep(.md-editor .md-editor-toolbar) {
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}
:deep(.md-editor .md-editor-content) {
  background: #fff;
  height: 100% !important;
}

/* 暗色主题 */
.pdf-to-md-editor.dark-mode .pdf-upload-section {
  border-right-color: #4b5563;
  background: #2a2a29;
}
.pdf-to-md-editor.dark-mode .preview-text {
  color: #d1d5db !important;
}
.pdf-to-md-editor.dark-mode .pdf-preview {
  background: #374151;
  border-color: #4b5563;
}
.pdf-to-md-editor.dark-mode .section-header {
  border-bottom-color: #4b5563;
}

/* MD头部工具栏暗色主题 */
.pdf-to-md-editor.dark-mode .md-header-toolbar {
  background: #2a2a29 !important;
  border-bottom-color: #4b5563 !important;
}

.pdf-to-md-editor.dark-mode .md-title {
  color: #e5e7eb !important;
}

.pdf-to-md-editor.dark-mode .md-header-btn {
  color: #d1d5db !important;
}

.pdf-to-md-editor.dark-mode .md-header-btn:hover {
  color: #60a5fa !important;
  background-color: rgba(96, 165, 250, 0.1) !important;
}

.pdf-to-md-editor.dark-mode .md-header-btn.active {
  color: #60a5fa !important;
  background-color: rgba(96, 165, 250, 0.15) !important;
}

.pdf-to-md-editor.dark-mode .divider {
  background: #4b5563 !important;
}

.pdf-to-md-editor.dark-mode :deep(.md-editor) {
  --md-bk-color: #2a2a29;
  --md-bk-color2: #2f2f2f;
  --md-color: #e5e7eb;
  --md-border-color: #4b5563;
  --md-hover-color: #e5e7eb;
  --md-active-color: #f3f4f6;
  --md-code-bk-color: #1f2937;
  --md-code-color: #e5e7eb;
}
.pdf-to-md-editor.dark-mode :deep(.md-editor .md-editor-toolbar) {
  background: var(--md-bk-color) !important;
  border-bottom-color: var(--md-border-color) !important;
}
.pdf-to-md-editor.dark-mode :deep(.md-editor .md-editor-toolbar button),
.pdf-to-md-editor.dark-mode :deep(.md-editor .md-editor-toolbar i) {
  color: var(--md-color) !important;
}
.pdf-to-md-editor.dark-mode :deep(.md-editor textarea) {
  background: var(--md-bk-color) !important;
  color: var(--md-color) !important;
  caret-color: var(--md-active-color) !important;
}
.pdf-to-md-editor.dark-mode :deep(.md-editor .md-editor-content) {
  background: var(--md-bk-color) !important;
}
.pdf-to-md-editor.dark-mode :deep(.md-editor .md-preview-wrapper) {
  background: var(--md-bk-color2) !important;
  color: var(--md-color) !important;
}
.pdf-to-md-editor.dark-mode :deep(.md-editor .md-split) {
  background: var(--md-border-color) !important;
}
.pdf-to-md-editor.dark-mode :deep(.md-editor pre),
.pdf-to-md-editor.dark-mode :deep(.md-editor code) {
  background: var(--md-code-bk-color) !important;
  color: var(--md-code-color) !important;
  border-color: var(--md-border-color) !important;
}

/* 链式高度保证铺满 - 修复滚动条问题 */
.pdf-to-md-editor {
  height: 100%;
  overflow: hidden;
}
.md-editor-section {
  height: 100%;
  overflow: hidden;
}
.editor-container-inner {
  height: calc(100% - 48px);
  display: flex;
  min-height: 0;
}
.editor-wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 确保MD编辑器不产生滚动条 */
:deep(.md-editor) {
  height: 100% !important;
  border-radius: 0;
  overflow: hidden;
}
:deep(.md-editor .md-editor-content) {
  height: calc(100vh - 120px) !important;
  overflow: auto;
}

/* ======= STYLE：贴到 <style scoped> 里 ======= */
.section-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--divider-color, rgba(60, 60, 67, 0.12));
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.left {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.section-title-sm {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

/* 右侧工具条：一行排列、紧凑 */
.right.controls-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;                 /* 元素之间的间距 */
  flex-wrap: nowrap;        /* 不换行，保持在一排 */
  min-width: 0;             /* 允许子项收缩 */
}

/* 所有文本按钮统一紧凑化 */
.text-btn,
.md-header-btn,
.zoom-btn {
  font-size: 12px !important;
  line-height: 1 !important;
  padding: 2px 6px !important;
}

/* 下拉按钮：限制宽度 + 省略号，避免把整排挤换行 */
.file-switch-btn {
  max-width: 260px;         /* 可按需要调小/调大 */
}
.file-name-ellipsis {
  display: inline-block;
  max-width: 220px;         /* 应小于 .file-switch-btn 的 max-width */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

/* 缩放区更紧凑 */
.zoom-text-controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.zoom-display {
  font-size: 12px;
  min-width: 42px;
  text-align: center;
}

/* 高亮“智能解析” */
.primary-accent {
  color: #1e9cef !important;
}

/* 激活态样式（单页模式） */
.text-btn.active {
  color:  #18a058;
}

/* 关闭按钮颜色（可选） */
.close-text {
  color: #ff4d4f;
}

/* 你原来 iframe 的容器建议有固定高度 */
.pdf-iframe {
  width: 100%;
  height: calc(100vh - 140px);
  display: block;
}

/* <style scoped> 中使用深度选择器 */
:deep(.n-upload-trigger:hover),
:deep(.n-upload-trigger--dragover) {
  border: none !important;     /* 去掉 hover 和 dragover 时的虚线 */
  outline: none !important;
  box-shadow: none !important;
}

</style>
