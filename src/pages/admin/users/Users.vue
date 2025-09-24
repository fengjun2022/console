<template>
  <ThemeContainer variant="main" :padding="'p-6'" class="min-h-[calc(100vh-4rem)]" :border="false" :shadow="false" :rounded="false">


    <div class="mb-6">
      <NButton type="primary" class="bg-gradient-to-r from-violet-500 to-blue-500 border-0">
        <NIcon :component="PersonAddOutline" class="mr-2" />
        添加用户
      </NButton>
    </div>

    <ThemeContainer 
      variant="card" 
      :shadow="'md'" 
      :blur="true" 
      :border-color="isDarkMode ? '#424242' : '#e5e7eb'"
      container-class="transition-colors duration-300"
    >
      <NDataTable
        :columns="columns"
        :data="users"
        :pagination="pagination"
        :bordered="false"
        :single-line="false"
        class="rounded-lg"
      />
    </ThemeContainer>
  </ThemeContainer>
</template>

<script lang="ts" setup>
import { NCard, NButton, NIcon, NDataTable } from 'naive-ui'
import { PersonAddOutline, PersonOutline, MailOutline } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import ThemeContainer from '@/components/ThemeContainer.vue'

const globalStore = useGlobalStore()
const { isDarkMode } = storeToRefs(globalStore)

const users = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: '普通用户',
    status: '活跃',
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: '普通用户',
    status: '离线',
    createdAt: '2024-02-01'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: '编辑',
    status: '活跃',
    createdAt: '2024-02-10'
  }
])

const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '用户名',
    key: 'name',
    render(row: any) {
      return h('div', { class: 'flex items-center space-x-2' }, [
        h('div', { class: isDarkMode.value ? 'text-blue-400 text-base' : 'text-blue-600 text-base' }, [
          h(PersonOutline)
        ]),
        h('span', { class: isDarkMode.value ? 'font-medium text-white' : 'font-medium text-gray-900' }, row.name)
      ])
    }
  },
  {
    title: '邮箱',
    key: 'email',
    render(row: any) {
      return h('div', { class: 'flex items-center space-x-2' }, [
        h('div', { class: isDarkMode.value ? 'text-blue-400 text-base' : 'text-blue-600 text-base' }, [
          h(MailOutline)
        ]),
        h('span', { class: isDarkMode.value ? 'text-gray-300' : 'text-gray-600' }, row.email)
      ])
    }
  },
  {
    title: '角色',
    key: 'role',
    render(row: any) {
      const colorMap: any = {
        '管理员': 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
        '编辑': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        '普通用户': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      }
      return h('span', {
        class: `px-2 py-1 rounded-full text-xs font-medium ${colorMap[row.role] || (isDarkMode.value ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700')}`
      }, row.role)
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const isActive = row.status === '活跃'
      return h('div', { class: 'flex items-center space-x-2' }, [
        h('div', {
          class: `w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`
        }),
        h('span', {
          class: `text-sm ${isActive ? 'text-emerald-600' : (isDarkMode.value ? 'text-gray-400' : 'text-slate-500')}`
        }, row.status)
      ])
    }
  },
  {
    title: '创建时间',
    key: 'createdAt',
    render(row: any) {
      return h('span', { class: isDarkMode.value ? 'text-gray-300' : 'text-gray-600' }, row.createdAt)
    }
  },
  {
    title: '操作',
    key: 'actions',
    render() {
      return h('div', { class: 'flex space-x-2' }, [
        h(NButton, {
          size: 'small',
          type: 'primary',
          text: true,
          class: isDarkMode.value ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
        }, { default: () => '编辑' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          text: true,
          class: 'text-red-500 hover:text-red-600'
        }, { default: () => '删除' })
      ])
    }
  }
]

const pagination = {
  pageSize: 10
}
</script>
