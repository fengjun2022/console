<template>
  <div v-if="showTable">
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
      <n-data-table :columns="columns" :data="tableData" :loading="loading" :pagination="pagination" />
    </div>
    <n-modal v-model:show="showModal" title="新增" preset="dialog" style="width: 40%">
      <n-form :model="addFormData" label-placement="left" label-width="150">
        <n-form-item label="招标名称" path="tenderName" required>
          <n-input v-model:value="addFormData.tenderName" placeholder="请输入" />
        </n-form-item>
        <n-form-item label="招标内容描述" path="tenderContent" required>
          <n-input v-model:value="addFormData.tenderContent" type="textarea" placeholder="请输入" />
        </n-form-item>
        <n-form-item label="招标类型" path="tenderType" required>
          <n-select v-model:value="addFormData.tenderType" placeholder="请选择" :options="tenderTypeOptions" />
        </n-form-item>
        <n-form-item label="发生时间" path="occurrenceTime" required>
          <n-input v-model:value="addFormData.occurrenceTime" placeholder="请输入" />
        </n-form-item>
        <n-form-item label="项目预算" path="tenderAmount" required>
          <n-input v-model:value="addFormData.tenderAmount" placeholder="请输入" />
        </n-form-item>
        <n-form-item label="上传文件">
          <n-upload directory-dnd action="#">
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <ArchiveIcon />
                </n-icon>
              </div>
              <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0"> 支持格式：当前仅支持POF、Word格式 </n-p>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
        <n-form-item label="审核配置项">
          <n-data-table :columns="addColumns" :data="addFormData.auditConfigurations" />
        </n-form-item>

        <n-form-item label="" path="tenderType" required>
          <n-space style="display: flex; width: 100%; justify-content: center">
            <n-button @click="cancel">取消</n-button>
            <n-button type="primary" @click="submit">确定</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
  <PDFviewVue v-else></PDFviewVue>
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
  NModal,
  NTable,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NP,
  NPopconfirm,
  useMessage,
} from 'naive-ui'
import { ref, h, reactive, onMounted } from 'vue'
import { CloudUpload as ArchiveIcon } from '@vicons/ionicons5'
import PDFviewVue from './PDF/index.vue'
import { getTenderQuery, tenderDelById, tenderQueryAdd } from '@/api'

const message = useMessage()
const showTable = ref(true)
const loading = ref(false)
const formValue = ref({
  tenderName: '',
  tenderType: null,
  contentKeyword: '',
  date: null,
  minAmount: null,
  maxAmount: null,
})
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page
    handleSearch()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    handleSearch()
  },
})
const typeOptions = [
  { label: '公开招标', value: '公开招标' },
  { label: '邀请招标', value: '邀请招标' },
  { label: '竞争性谈判', value: '竞争性谈判' },
  { label: '单一来源采购', value: '单一来源采购' },
  { label: '询价采购', value: '询价采购' },
]
const tableData = ref([])
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
    title: '招标内容',
    key: 'tenderContent',
  },
  {
    title: '招标金额',
    key: 'minioBucket',
  },
  {
    title: '招标类型',
    key: 'tenderType',
  },
  {
    title: '发生时间',
    key: 'occurrenceTime',
  },
  {
    title: '操作',
    key: 'address',
    render(row: any) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: () => handleView(row),
              },
              { default: () => '查看' },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => tableDelete(row),
                positiveText: '确认',
                negativeText: '取消',
              },
              {
                default: () => '删除后将无法恢复，是否确认删除',
                trigger: h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    style: 'margin-left: 8px',
                  },
                  { default: () => '删除' },
                ),
              },
            ),
          ],
        },
      )
    },
  },
])
const showModal = ref(false)
// 查询方法
const handleSearch = async () => {
  try {
    const params: Record<string, any> = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...Object.fromEntries(Object.entries(formValue.value).filter(([key]) => key !== 'date')),
    }
    if (formValue.value.date?.length === 2) {
      params.startTime = formdataTime(formValue.value.date[0])
      params.endTime = formdataTime(formValue.value.date[1], true)
    }
    loading.value = true
    const res = await getTenderQuery<any>(params)
    const startIndex = (pagination.pageNum - 1) * pagination.pageSize
    tableData.value = res.records.map((item: any, index: number) => ({
      ...item,
      index: startIndex + index + 1,
    }))
    pagination.total = res.total
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

// 查看方法
const handleView = (row: any) => {
  showTable.value = false
}

// 删除方法
const tableDelete = async (row: any) => {
  try {
    const res = await tenderDelById(row.id)
    message.success('删除成功')
    handleSearch()
  } catch (error) {}
}

// 新增的逻辑代码
const addFormData = ref({
  tenderName: '',
  tenderContent: '',
  tenderType: '',
  occurrenceTime: '',
  tenderAmount: '',
  auditConfigurations: [{ templateName: '模版一', templateType: '软件采购' }],
})
const tenderTypeOptions = [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  // 可以添加更多选项
]

const addColumns = [
  {
    title: '模版名称',
    key: 'templateName',
    align: 'center',
    render(row: any) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
              },
              { default: () => row.templateName },
            ),
          ],
        },
      )
    },
  },
  {
    title: '模版类型',
    key: 'templateType',
    align: 'center',
    render(row: any) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
              },
              { default: () => row.templateType },
            ),
          ],
        },
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(row: any) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => tableDelete(row),
          onNegativeClick: () => console.log('取消删除'),
          positiveText: '确认',
          negativeText: '取消',
        },
        {
          default: () => '删除后将无法恢复，是否确认删除',
          trigger: h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: 'margin-left: 8px',
            },
            '删除',
          ),
        },
      )
    },
  },
]
const fileList = ref([])
// 删除方法
const handleDelete = (row: any) => {}
// 取消按钮
const cancel = () => {
  showModal.value = false
  addFormData.value = {
    tenderType: null,
    budget: '',
    description: '',
    auditConfigurations: [{ templateName: '模版一', templateType: '软件采购' }],
  }
}
// 新增按钮
const submit = async () => {
  console.log(addFormData.value)
  try {
    const res = await tenderQueryAdd()
  } catch (error) {}
}

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

/deep/ .n-form-item-blank {
  width: 100%;
}

.floatR10 {
  margin-right: 10px;
}
.addBtn {
  float: right;
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
