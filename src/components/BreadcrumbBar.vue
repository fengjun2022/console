<template>
  <div
    class="sticky h-[50px] top-0 z-20 flex items-center justify-between px-6 backdrop-blur-md "
    :class="[!isHeaderVisible && 'border-b' ]"
    :style="{
            borderColor: themeColors.sidebarBorder  }"
  >
    <!-- 左侧：面包屑 -->
    <div class="min-w-0">
      <NBreadcrumb>
        <NBreadcrumbItem
          v-for="(c, i) in crumbs"
          :key="c.path || i"
          :clickable="i < crumbs.length - 1"
          @click="i < crumbs.length - 1 && go(c)"
        >
          <span :class="[isDarkMode ? 'text-white' : 'text-gray-900', i === crumbs.length - 1 ? 'font-semibold' : '']">
            {{ c.title }}
          </span>
        </NBreadcrumbItem>
      </NBreadcrumb>
    </div>

    <!-- 右侧：返回上一级 -->
    <div class="flex items-center gap-2">
      <NButton size="small" quaternary :class="isDarkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'" @click="goBack">
        <NIcon :component="ChevronBackOutline" class="mr-1" /> 返回上一级
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useRoute, useRouter } from 'vue-router'
import { NBreadcrumb, NBreadcrumbItem, NButton, NIcon } from 'naive-ui'
import { ChevronBackOutline } from '@vicons/ionicons5'
import { getThemeColors } from '@/config/theme'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()
const { isDarkMode,isHeaderVisible } = storeToRefs(globalStore)

const themeColors = computed(() => {
  return getThemeColors(isDarkMode.value ? 'dark' : 'light')
})

// 从 matched 里取每级的 meta.title；没有就用 name
const crumbs = computed(() =>
  route.matched
    .filter(r => r.meta?.breadcrumb !== false)           // 过滤掉布局路由
    .filter(r => !!r.meta?.title)                        // 只要有标题的
    .map(r => ({
      title: r.meta!.title as string,
      path: r.path || ''
    }))
)

const go = (c: { path?: string }) => {
  if (c.path) router.push(c.path)
}

const goBack = (e:Event) => {
  if (window.history.length > 1) {
    router.back()
  } else {
    const parent = route.matched.at(-2)
    parent ? router.push(parent.path) : router.push({ name: 'dashboard' })
  }

  (e.currentTarget as HTMLElement)?.blur() // ✅ 取消焦点，去掉灰底

}
</script>
