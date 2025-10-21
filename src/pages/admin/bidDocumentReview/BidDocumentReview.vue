<template>
  <div class="bid-document-review-page">
    <div>
      <div>
        <n-form
          ref="formRef"
          class="form-container"
          :label-width="80"
          label-placement="left"
          :model="formValue"
          size="small"
        >
          <n-form-item class="n-form-item" label="招标名称" path="tenderName">
            <n-input v-model:value="formValue.tenderName" placeholder="请输入招标名称" />
          </n-form-item>
          <n-form-item class="n-form-item" label="招标类型" path="tenderType">
            <n-select
              class="form-item-uniform"
              v-model:value="formValue.tenderType"
              placeholder="请选择招标类型"
              :options="typeOptions"
              clearable
            />
          </n-form-item>
          <n-form-item class="n-form-item" label="关键词" path="contentKeyword">
            <n-input v-model:value="formValue.contentKeyword" placeholder="请输入关键词" />
          </n-form-item>
          <n-form-item class="n-form-item" label="招标日期" path="date">
            <n-date-picker
              v-model:value="formValue.date"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              type="daterange"
              clearable
            />
          </n-form-item>
          <n-form-item class="n-form-item" label="最小金额" path="minAmount">
            <n-input v-model:value="formValue.minAmount" placeholder="请输入最小金额" />
          </n-form-item>
          <n-form-item class="n-form-item" label="最大金额" path="maxAmount">
            <n-input v-model:value="formValue.maxAmount" placeholder="请输入最大金额" />
          </n-form-item>
          <n-form-item class="n-form-item" label=" ">
            <n-button class="floatR10" @click="handleReset">重置</n-button>
            <n-button type="primary" @click="handleSearch">查询</n-button>
          </n-form-item>
        </n-form>
      </div>
      <div>
        <n-button class="addBtn" type="primary" @click="showModal = true" size="small">新增</n-button>
        <n-data-table
          :columns="columns as any"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
        />
      </div>
      <AddReviewModal v-model:show="showModal" @submitted="handleSearch" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NDatePicker,
  NButton,
  NDataTable,
  NSpace,
  NPopconfirm,
  NTag,
  useMessage,
} from 'naive-ui'
import { ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AddReviewModal from './components/AddReviewModal.vue'
import { searchTenderDataList, tenderDelById, tenderStart } from '@/api/tenderfiletask'

const message = useMessage()
const router = useRouter()
const loading = ref(false)
const formValue = ref({
  tenderName: '',
  tenderType: null,
  contentKeyword: '',
  date: null as null | [number, number],
  minAmount: null,
  maxAmount: null,
})

const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  page: 0,
  total: 0,
  onChange: (page: number) => {
    pagination.value.page = page
    handleSearch()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    handleSearch()
  },
})

const typeOptions = [
  { label: '公开招标', value: '公开招标' },
  { label: '邀请招标', value: '邀请招标' },
  { label: '竞争性磋商文件', value: '竞争性磋商文件' },
  { label: '单一来源采购', value: '单一来源采购' },
  { label: '询价采购', value: '询价采购' },
]

const tableData = ref([])
// 行内“开始”按钮加载态映射：key 为行 id/index，值为是否 loading
const startingMap = ref<Record<string | number, boolean>>({})
const columns = ref([
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'index',
  },
  {
    title: '招标名称',
    key: 'tenderName',
  },

  {
    title: '招标类型',
    key: 'tenderType',
  },
  {
    title: '当前进度',
    key: 'statusDesc',
    render(row: any) {
      const status = Number(row.status ?? row.statusCode ?? row.state ?? -1)
      const type =
        status === 0 ? 'warning' : status === 1 ? 'info' : status === 2 ? 'success' : status === 3 ? 'error' : 'default'
      const text = row.statusDesc ?? String(status)
      return h(NTag, { type, size: 'small', bordered: false, style: { borderRadius: '4px' } }, { default: () => text })
    },
  },

  {
    title: '文件名称',
    key: 'fileName',
  },
  {
    title: () => h('span', { class: 'no-wrap-header' }, '问题总数'),
    key: 'questionTotal',
    className: 'col-question-total',
    minWidth: 100,
  },
  {
    title: '预计完成时间',
    key: 'estimatedTime',
  },

  {
    title: '创建时间',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'address',
    minWidth: 260,
    render(row: any) {
      const status = Number(row.status ?? row.statusCode ?? row.state ?? -1)
      const isStarting = !!startingMap.value[(row.id ?? row.index ?? '') as any]
      const actionBtn = (() => {
        if (status === 0) {
          return h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => handleStart(row),
              loading: isStarting,
              disabled: isStarting,
            },
            { default: () => (isStarting ? '文件内容解析中' : '开始') },
          )
        }
        if (status === 1) {
          return h(
            NButton,
            { size: 'small', type: 'warning', onClick: () => handleStop(row) },
            { default: () => '停止' },
          )
        }
        if (status === 2) {
          return h(
            NButton,
            { size: 'small', type: 'primary', onClick: () => handleView(row) },
            { default: () => '查看' },
          )
        }
        if (status === 3) {
          return h(
            NButton,
            { size: 'small', type: 'success', onClick: () => handleRetry(row) },
            { default: () => '重试' },
          )
        }
        // 默认：查看
        return h(NButton, { size: 'small', type: 'primary', onClick: () => handleView(row) }, { default: () => '查看' })
      })()

      const canDelete = status !== 1
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => {
            const actions: any[] = [actionBtn]
            if (canDelete) {
              actions.push(
                h(
                  NPopconfirm,
                  {
                    onPositiveClick: () => tableDelete(row),
                    positiveText: '确认',
                    negativeText: '取消',
                  },
                  {
                    default: () => '删除后将无法恢复，是否确认删除',
                    trigger: () =>
                      h(
                        NButton,
                        { size: 'small', type: 'error', style: 'margin-left: 8px' },
                        { default: () => '删除' },
                      ),
                  },
                ),
              )
            }
            return actions
          },
        },
      )
    },
  },
])

const showModal = ref(false)

// 查询方法
const handleSearch = async () => {
  try {
    const params: any = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
    }

    loading.value = true
    const res = await searchTenderDataList<any>(params)
    const startIndex = (pagination.value.pageNum - 1) * pagination.value.pageSize
    console.log(res.data)
    tableData.value = res.data.records.map((item: any, index: number) => ({
      ...item,
      index: startIndex + index + 1,
    }))
    pagination.value.total = res.data.total
  } catch (error: any) {
    console.error('请求异常:', error)
    message.error(error.message || '请求失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 处理时间格式
const formdataTime = (timestamp: any, faly = false) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  if (!faly) {
    return `${year}-${month}-${day} 00:00:00`
  } else {
    return `${year}-${month}-${day} 23:59:59`
  }
}

// 重置方法
const handleReset = () => {
  formValue.value = {
    tenderName: '',
    tenderType: null,
    contentKeyword: '',
    date: null,
    minAmount: null,
    maxAmount: null,
  }
}

// 查看方法：跳转到独立页面并携带行参数
const handleView = (row: any) => {
  try {
    const payload = encodeURIComponent(JSON.stringify(row ?? {}))
    router.push({ name: 'bidDocumentReviewView', query: { row: payload } })
  } catch (e) {
    // 兜底：若序列化失败，仅传 id
    router.push({ name: 'bidDocumentReviewView', query: { id: String(row?.id ?? '') } })
  }
}

// 开始任务（按钮进入加载态并显示“文件内容解析中”）
const handleStart = async (row: any) => {
  const key = (row.id ?? row.index ?? '') as any
  try {
    startingMap.value[key] = true
    await tenderStart(row.id)
    message.success('任务已开始')
    await handleSearch()
  } catch (e) {
    message.error('开始失败')
  } finally {
    startingMap.value[key] = false
  }
}

// 停止任务
const handleStop = async (row: any) => {
  try {
    // TODO: 调用停止接口（如有）
    message.success('已停止')
    await handleSearch()
  } catch (e) {
    message.error('停止失败')
  }
}

// 重试任务
const handleRetry = async (row: any) => {
  try {
    // TODO: 调用重试接口（如有）
    message.success('已重试')
    await handleSearch()
  } catch (e) {
    message.error('重试失败')
  }
}

// 删除方法（状态为 1 不可删除）
const tableDelete = async (row: any) => {
  const status = Number(row.status ?? row.statusCode ?? row.state ?? -1)
  if (status === 1) {
    message.warning('该状态下不可删除')
    return
  }
  try {
    console.log(row.id)
    const res = await tenderDelById({docId: row.docId,id: row.id})
    message.success('删除成功')
    handleSearch()
  } catch (error) {}
}

// data table row key resolver
const rowKey = (row: any) => row.id ?? row.index ?? `${row.tenderName ?? ''}-${row.occurrenceTime ?? ''}`

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
/* 关键样式：启用flex布局并允许换行 */
.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* 控制表单项间距 */
}

/* 调整表单项宽度适应换行 */
.n-form-item {
  display: flex;
  min-width: 200px; /* 最小宽度保证布局 */
  margin-bottom: 15px;
}

.form-item-uniform {
  min-width: 204px;
}
/* 响应式调整：小屏幕时缩小标签宽度 */
@media (max-width: 600px) {
  .n-form :deep(.n-form-item-label) {
    width: 60px; /* 移动端缩小标签宽度 */
  }
}

.floatR10 {
  margin-right: 10px;
}
.addBtn {
  float: right;
  margin-bottom: 10px;
  margin-right: 20px;
}

/* 以上为列表区域样式，新增模态相关样式已封装至子组件 */
/* 表头不换行样式 */
.no-wrap-header { white-space: nowrap; }
/* 精确针对“问题总数”列的表头元素，防止换行 */
:deep(.col-question-total .n-data-table-th__title) {
  white-space: nowrap;
  word-break: keep-all;
}
</style>
