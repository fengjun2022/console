
<template>
<div>111</div>

</template>
<script lang="ts" setup>
import {  NGrid, NGridItem, NIcon, NSpace, NH2, NProgress, NStatistic, NButton } from 'naive-ui'
import { BarChartOutline, PeopleOutline, TrendingUpOutline, CashOutline, EyeOutline, EyeOffOutline } from '@vicons/ionicons5'
import { useGlobalStore } from '@/stores/global-store'
import { storeToRefs } from 'pinia'
import ThemeContainer from '@/components/ThemeContainer.vue'

const globalStore = useGlobalStore()
const { isDarkMode } = storeToRefs(globalStore)

</script>
