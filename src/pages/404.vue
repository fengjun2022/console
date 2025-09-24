<script lang="ts" setup>
import NotFoundImage from '@/components/NotFoundImage.vue'
import { NButton } from 'naive-ui'
</script>

<template>
  <div class="flex flex-col justify-between h-screen items-center bg-gray-50">
    <RouterLink to="/">
      <h1 class="text-2xl font-bold text-blue-600 my-8">控制台</h1>
    </RouterLink>

    <div class="flex flex-col items-center gap-6 px-4 my-8">
      <NotFoundImage />
      <h1 class="text-center text-5xl font-bold text-gray-900">页面未找到</h1>

      <p class="text-center text-gray-600">
        您访问的页面可能已被删除、更名或暂时不可用。
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <RouterLink to="/">
          <NButton type="primary" size="large">返回首页</NButton>
        </RouterLink>
      </div>
    </div>

    <div />
  </div>
</template>
