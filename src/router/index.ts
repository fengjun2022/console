import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/modules/useUserStore'

import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    meta: { breadcrumb: false },   // ✅ 不显示在面包屑

    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('@/pages/admin/dashboard/Dashboard.vue'),
        meta: { title: '首页', icon: 'HomeOutline' },
      },
      {
        name: 'bidDocumentReview',
        path: 'bidDocumentReview',
        component: () => import('@/pages/admin/bidDocumentReview/BidDocumentReview.vue'),
        meta: { title: '招标文件审核', icon: 'HomeOutline' },
      },
      {
        name: 'test',
        path: 'test',
        meta: { title: '测试', icon: 'SettingsOutline' },
        redirect: { name: 'test1' },
        children: [{
          name: 'test1',
          path: 'test1',
          component: () => import('@/pages/system/pages/test1.vue'),
          meta: { title: '测试1' },
        },
        {
          name: 'test2',
          path: 'test2',
          component: () => import('@/pages/system/pages/test2.vue'),
          meta: { title: '测试3' },
        },
        {
          name: 'pdf-editor',
          path: 'pdf-editor',
          component: () => import('@/pages/system/pages/pdf-editor.vue'),
          meta: { title: 'PDF编辑器' },
        },
        {
          name: 'course-management',
          path: 'course-management',
          component: () => import('@/pages/system/pages/course-management.vue'),
          meta: { title: '课程管理' },
        }]
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('@/pages/auth/Login.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on pages navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = !!userStore.token

  if (to.path.startsWith('/auth')) {
    if (isLoggedIn) {
      next('/')
    } else {
      next()
    }
  } else {
    if (!isLoggedIn) {
      next('/auth/login')
    } else {
      next()
    }
  }
})

export default router
