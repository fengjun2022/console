<template>
  <div
    :class="[
      'transition-all duration-300',
      containerClass,
      // 背景色
      isDarkMode ? darkBg : lightBg,
      // 边框
      getBorderClasses(),
      // 阴影
      getShadowClasses(),
      // 圆角
      getRoundedClasses(),
      // 内边距
      getPaddingClasses(),
      // 背景模糊
      blur && 'backdrop-blur-sm'
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'

interface Props {
  // 容器类型
  variant?: 'card' | 'sidebar' | 'main' | 'header' | 'custom'
  // 自定义类名
  containerClass?: string
  // 边框控制
  border?: boolean | 'top' | 'right' | 'bottom' | 'left' | 'x' | 'y'
  // 自定义边框颜色
  borderColor?: string
  // 边框宽度
  borderWidth?: '1' | '2' | '4' | '8'
  // 阴影
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl'
  // 圆角
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  // 内边距
  padding?: 'sm' | 'md' | 'lg' | string | false
  // 背景模糊
  blur?: boolean
  // 自定义背景色
  lightBg?: string
  darkBg?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'card',
  containerClass: '',
  border: true,
  shadow: true,
  rounded: true,
  padding: 'md',
  blur: false,
  lightBg: '',
  darkBg: ''
})

const globalStore = useGlobalStore()
const { isDarkMode } = storeToRefs(globalStore)

// 根据variant设置默认背景色
const lightBg = props.lightBg || getDefaultLightBg(props.variant)
const darkBg = props.darkBg || getDefaultDarkBg(props.variant)

function getDefaultLightBg(variant: string): string {
  switch (variant) {
    case 'sidebar':
      return 'bg-[#f9f9f9]'
    case 'main':
      return 'bg-white'
    case 'header':
      return 'bg-white/80'
    case 'card':
    default:
      return 'bg-white/80'
  }
}

function getDefaultDarkBg(variant: string): string {
  switch (variant) {
    case 'sidebar':
      return 'bg-[#1f1e1d]'
    case 'main':
      return 'bg-[#262624]'
    case 'header':
      return 'bg-[#262624]/80'
    case 'card':
    default:
      return 'bg-[#1f1e1d]/80'
  }
}

// 边框类名
function getBorderClasses(): string[] {
  if (!props.border) return []
  
  const width = props.borderWidth ? `border-${props.borderWidth}` : 'border'
  const defaultColor = isDarkMode.value ? 'border-[#424242]' : 'border-gray-200'
  const color = props.borderColor ? `border-[${props.borderColor}]` : defaultColor
  
  if (props.border === true) {
    return [width, color]
  }
  
  const borderMap: Record<string, string> = {
    top: `border-t${props.borderWidth ? `-${props.borderWidth}` : ''}`,
    right: `border-r${props.borderWidth ? `-${props.borderWidth}` : ''}`,
    bottom: `border-b${props.borderWidth ? `-${props.borderWidth}` : ''}`,
    left: `border-l${props.borderWidth ? `-${props.borderWidth}` : ''}`,
    x: `border-x${props.borderWidth ? `-${props.borderWidth}` : ''}`,
    y: `border-y${props.borderWidth ? `-${props.borderWidth}` : ''}`
  }
  
  return [borderMap[props.border as string], color]
}

// 阴影类名
function getShadowClasses(): string[] {
  if (!props.shadow) return []
  
  if (props.shadow === true) {
    return isDarkMode.value 
      ? ['shadow-lg', 'shadow-black/20'] 
      : ['shadow-md', 'shadow-gray-200/50']
  }
  
  const shadowMap: Record<string, string[]> = {
    sm: isDarkMode.value ? ['shadow-sm', 'shadow-black/10'] : ['shadow-sm', 'shadow-gray-200/30'],
    md: isDarkMode.value ? ['shadow-md', 'shadow-black/15'] : ['shadow-md', 'shadow-gray-200/40'],
    lg: isDarkMode.value ? ['shadow-lg', 'shadow-black/20'] : ['shadow-lg', 'shadow-gray-200/50'],
    xl: isDarkMode.value ? ['shadow-xl', 'shadow-black/25'] : ['shadow-xl', 'shadow-gray-200/60']
  }
  
  return shadowMap[props.shadow as string] || []
}

// 圆角类名
function getRoundedClasses(): string {
  if (!props.rounded) return ''
  
  if (props.rounded === true) return 'rounded-lg'
  
  const roundedMap: Record<string, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  
  return roundedMap[props.rounded as string] || ''
}

// 内边距类名
function getPaddingClasses(): string {
  if (!props.padding) return ''
  
  const paddingMap: Record<string, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return paddingMap[props.padding] || props.padding
}
</script>