import { HomeOutline, SettingsOutline } from '@vicons/ionicons5'
import type { Router, RouteRecordNormalized } from 'vue-router'

export interface MenuItem {
  label: string
  key: string
  icon?: any
  children?: MenuItem[]
  path?: string
  redirect?: string
}

// 图标映射
const iconMap: Record<string, any> = {
  'HomeOutline': HomeOutline,
  'SettingsOutline': SettingsOutline,
}

// 直接从路由配置中生成菜单选项
export function generateMenuFromRouter(router: Router): MenuItem[] {
  const routes = router.getRoutes()

  // 找到 AppLayout 下的所有子路由
  const appRoute = routes.find(route => route.name === 'admin')
  if (!appRoute || !appRoute.children) {
    return []
  }

  // 递归处理路由，构建菜单结构
  const processRoute = (route: RouteRecordNormalized): MenuItem | null => {
    if (!route.name || !route.meta?.title) {
      return null
    }

    const menuItem: MenuItem = {
      label: route.meta.title as string,
      key: route.name as string,
      path: route.path.startsWith('/') ? route.path : `/${route.path}`,
      icon: route.meta.icon ? iconMap[route.meta.icon as string] : undefined
    }

    // 如果有 redirect，添加到菜单项
    if (route.redirect) {
      if (typeof route.redirect === 'object' && 'name' in route.redirect) {
        menuItem.redirect = route.redirect.name as string
      } else if (typeof route.redirect === 'string') {
        menuItem.redirect = route.redirect
      }
    }

    // 如果有子路由，递归处理
    if (route.children && route.children.length > 0) {
      const children: MenuItem[] = []
      route.children.forEach(childRoute => {
        const childMenuItem = processRoute(<RouteRecordNormalized>childRoute)
        if (childMenuItem) {
          children.push(childMenuItem)
        }
      })
      if (children.length > 0) {
        menuItem.children = children
      }
    }

    return menuItem
  }

  // 处理所有子路由
  const menuItems: MenuItem[] = []
  appRoute.children.forEach(route => {
    const menuItem = processRoute(<RouteRecordNormalized>route)
    if (menuItem) {
      menuItems.push(menuItem)
    }
  })

  return menuItems
}
