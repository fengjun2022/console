<template>
  <div class="pdf-container">
    <div class="container-left">
      <PdfPreview ref="pdfRef" :url="pdfUrl" />
    </div>
    <div class="container-right">
      <div class="templateName nameColor">模版一：软件采购</div>
      <div class="container-right-main">
        <div class="container-right-main-header divMB10">
          <div class="nameColor">问题拆解</div>
          <div class="container-right-main-header-right">
            <div>
              <n-icon>
                <RefreshOutline />
              </n-icon>
              <div class="iconLeft">重新生成</div>
            </div>
            <div>
              <n-icon>
                <CopyOutline />
              </n-icon>
              <div class="iconLeft">复制</div>
            </div>
          </div>
        </div>
        <div class="divMB10">根据审核结果统计：共 {{ totalCount }} 条，符合项 {{ conformingCount }} 条，不符合项 {{ riskyCount }} 条</div>
        <div class="displayFlex divMB10">
          <div @click="isConforming = true"><n-tag :type="isConforming ? 'info' : ''"> 符合项({{ conformingCount }}) </n-tag></div>
          <div class="marginLeft20" @click="isConforming = false">
            <n-tag :type="!isConforming ? 'info' : ''"> 不符合项({{ riskyCount }}) </n-tag>
          </div>
        </div>
        <div v-for="(item, idx) in (isConforming ? conforming : risky)" :key="`${item?.id ?? 'row'}-${idx}`" class="mian-item">
          <div style="padding: 10px">
            <n-collapse :default-expanded-names="['1']">
              <n-collapse-item :title="(idx + 1) + '. ' + (item.question || '问题')" name="1">
                <div class="kv"><span class="k">识别结果：</span><span class="v">{{ item.result }}</span></div>
                <div class="kv"><span class="k">结论：</span><span class="v">{{ item.comparison }}</span></div>
                <n-collapse>
                  <n-collapse-item title="引用" name="ref">
                    <div class="refs">
                      <div
                        v-for="(refItem, rIdx) in (item.referenceObject || [])"
                        :key="`${refItem?.chunkId ?? 'ref'}-${rIdx}`"
                        class="ref-item"
                        @click="jumpTo(refItem)"
                      >
                        <div class="ref-text" v-html="sanitizeHtml(refItem.chunkText)"></div>
                        <div class="ref-page">第 {{ refItem.minPage === refItem.maxPage ? refItem.minPage : (refItem.minPage + '-' + refItem.maxPage) }} 页</div>
                      </div>
                    </div>
                  </n-collapse-item>
                </n-collapse>
              </n-collapse-item>
              <div style="padding: 10px 0 0 10px">
                <n-icon color="#999" size="20">
                  <EllipsisHorizontal />
                </n-icon>
                <n-icon style="margin: 0 10px" color="red" size="20">
                  <HeartCircleOutline />
                </n-icon>
                <n-icon size="20">
                  <HeartDislikeCircleOutline />
                </n-icon>
              </div>
            </n-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NTag, NCollapse, NCollapseItem } from 'naive-ui'
import {
  RefreshOutline,
  CopyOutline,
  EllipsisHorizontal,
  HeartCircleOutline,
  HeartDislikeCircleOutline,
} from '@vicons/ionicons5'
import { ref, h, computed } from 'vue'
import PdfPreview from './PDF.vue'
const props = defineProps<{ pdfUrl?: string, results?: Array<any> }>()

const pdfRef = ref<any>(null)
const isConforming = ref(true)

const conforming = computed(() => (props.results || []).filter((x) => x?.result === '满足'))
// 将“风险”和“未通过”均归入不符合项，避免漏展示
const risky = computed(() => (props.results || []).filter((x) => x?.result === '风险' || x?.result === '未通过'))
const conformingCount = computed(() => conforming.value.length)
const riskyCount = computed(() => risky.value.length)
const totalCount = computed(() => (props.results || []).length)

function jumpTo(refItem: any) {
  const base = (refItem?.minPage ?? refItem?.maxPage ?? 1)
  const page = Number(base) + 1
  pdfRef.value?.goToPage?.(page)
}

// 简单 HTML 清洗：移除可能破坏布局的标签，
// 并将 table/tr/td 等替换为 div，避免未闭合表格导致后续项被吞掉
function sanitizeHtml(html: string) {
  if (!html) return ''
  try {
    let s = String(html)
    // 移除危险标签
    s = s.replace(/<\/?(script|style|iframe)[^>]*>/gi, '')
    // 将 table 相关标签替换为 div，尽量保证结构闭合
    s = s
      .replace(/<\/?(thead|tbody|tfoot)[^>]*>/gi, '')
      .replace(/<\/?table([^>]*)>/gi, (m) => (m.startsWith('</') ? '</div>' : '<div>'))
      .replace(/<\/?tr([^>]*)>/gi, (m) => (m.startsWith('</') ? '</div>' : '<div>'))
      .replace(/<\/?t[hd]([^>]*)>/gi, (m) => (m.startsWith('</') ? '</div>' : '<div>'))
    return s
  } catch (e) {
    return String(html)
  }
}
</script>
<style scoped>
.pdf-container {
  display: flex;
  gap: 12px;
  align-items: stretch;
  padding-bottom: 20px;
}
.container-left {
  flex: 1;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(23, 28, 33, 0.05);
  overflow: hidden;
}
.container-right {
  flex: 1;
  padding: 10px;
  height: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(23, 28, 33, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.container-right-main {
  border: none;
  border-radius: 8px;
  padding: 10px;
  height: calc(100vh - 200px);
  overflow-y: auto;
  background: transparent;
}

.container-right-main-header {
  display: flex;
  justify-content: space-between;
}
.container-right-main-header-right {
  display: flex;
}
.container-right-main-header-right div {
  display: flex;
  align-items: center;
  color: #999;
  margin-right: 10px;
}
.container-right-main-header-right div:hover {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #229afd;
}
.mian-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.mian-item:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.displayFlex {
  display: flex;
}
.divMB10 {
  margin-bottom: 10px;
}
.marginLeft20 {
  margin-left: 20px;
}
.iconLeft {
  margin-left: 5px;
}
.nameColor {
  color: #229afd;
}

.kv { margin: 6px 0; line-height: 1.6; }
.kv .k { color: #666; }
.kv .v { color: #333; }
.refs { margin-top: 4px; }
.ref-item { padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; cursor: pointer; }
.ref-item:hover { background-color: #f6faff; border-color: #cfe8ff; }
.ref-text { color: #333; white-space: pre-wrap; }
.ref-page { margin-top: 4px; color: #999; font-size: 12px; }
.ref-text :deep(*) { max-width: 100%; word-break: break-word; }
.ref-item :deep(a) { pointer-events: none; }
</style>
