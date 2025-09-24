export type ThemeMode = 'light' | 'dark'

export const themeConfig = {
  light: {
    // 背景色
    sidebar: '#f9f9f9', // 侧边栏
    main: '#ffffff', // 主体
    card: '#ffffff', // 卡片颜色
    component: '#ffffff', // naive ui 组件背景色
    editor: '#ffffff', // PDF编辑器专用背景色

    // 边框色
    border: '#e5e7eb',
    sidebarBorder: '#e5e7eb',

    // 文本色
    text: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',

    // 按钮色
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#6b7280',
    secondaryHover: '#4b5563',

    // 悬浮色
    hover: '#00000020',
    hoverSecondary: '#e5e7eb',

    // 按下去背景颜色
    pressColor: '#00000020',


  },
  dark: {
    // 背景色
    sidebar: '#1f1e1d',
    main: '#262624',
    card: '#1f1e1d',
    component: '#262624',
    editor: '#1e1d1c', // PDF编辑器专用背景色

    // 边框色
    border: '#4b5563',
    sidebarBorder: '#474747',


    // 文本色
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',

    // 按钮色
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#6b7280',
    secondaryHover: '#9ca3af',

    // 悬浮色
    hover: '#ffffff20',
    hoverSecondary: '#4b5563',

    // 按下去背景颜色
    pressColor: '#ffffff20',
  }
} as const

export const getThemeColors = (theme: ThemeMode) => {
  return themeConfig[theme]
}

// CSS 变量名配置
export const CSS_VARIABLES = {
  // 背景色
  SIDEBAR_BG: '--theme-sidebar-bg',
  MAIN_BG: '--theme-main-bg',
  CARD_BG: '--theme-card-bg',

  // 边框色
  BORDER: '--theme-border',
  SIDEBAR_BORDER: '--theme-sidebar-border',

  // 文本色
  TEXT: '--theme-text',
  TEXT_SECONDARY: '--theme-text-secondary',
  TEXT_MUTED: '--theme-text-muted',

  // 按钮色
  PRIMARY: '--theme-primary',
  PRIMARY_HOVER: '--theme-primary-hover',
  SECONDARY: '--theme-secondary',
  SECONDARY_HOVER: '--theme-secondary-hover',

  // 悬浮色
  HOVER: '--theme-hover',
  HOVER_SECONDARY: '--theme-hover-secondary',
} as const

// 应用主题到 CSS 变量
export const applyThemeToDocument = (theme: ThemeMode) => {
  const colors = getThemeColors(theme)
  const root = document.documentElement

  // 应用所有颜色变量
  Object.entries(CSS_VARIABLES).forEach(([key, cssVar]) => {
    const colorKey = key.toLowerCase().replace(/_/g, '') as keyof typeof colors
    const colorValue = colors[colorKey as keyof typeof colors]
    if (colorValue) {
      root.style.setProperty(cssVar, colorValue)
    }
  })

  // 设置 dark class
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// 初始化主题 - 在应用启动时调用
export const initTheme = () => {
  // 检查本地存储的主题设置
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null
  let theme: ThemeMode = 'light'

  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    theme = savedTheme
  } else {
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme = prefersDark ? 'dark' : 'light'
  }

  applyThemeToDocument(theme)
  return theme
}
