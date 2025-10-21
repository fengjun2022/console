<template>
  <div>
    <n-modal v-model:show="showModal" title="新增审核" preset="dialog" style="width: 50%">
      <n-form :model="addFormData" label-width="130" label-placement="left">
        <div class="mb-3">
          <div class="font-bold text-[16px] mb-2">采购计划</div>
          <div style="max-height: 400px; overflow-y: auto">
            <div v-for="(field, index) in customFields" :key="index">
              <n-form-item
                :require-mark-placement="'right-hanging'"
                class="!w-fit custom-label-right"
                v-if="field.isNew"
                label="新计划"
              >
                <n-space class="!w-fit">
                  <n-input v-model:value="field.key" placeholder="计划名称" style="width: 150px" />
                  <n-input v-model:value="field.value" placeholder="计划内容" style="flex: 1; min-width: 0" />
                  <n-button type="success" size="small" @click="confirmAdd(field)"> 确定 </n-button>
                  <n-button type="error" size="small" @click="removeCustomField(index)"> 删除 </n-button>
                </n-space>
              </n-form-item>

              <n-form-item
                :required="field.isFixed"
                :show-require-mark="field.isFixed"
                v-else
                :label="field.key"
                :feedback="field.error"
                class="!w-fit custom-label-right text-nowrap"
                :validation-status="field.error ? 'error' : undefined"
                :require-mark-placement="'right-hanging'"
              >
                <template v-if="field.edit">
                  <n-space class="field-space" style="align-items: center">
                    <n-select
                      v-if="field?.option?.length"
                      v-model:value="field.value"
                      @update:value="() => clearFieldError(field)"
                      :options="field.option"
                      :placeholder="'请选择' + field.key"
                      style="flex: 1; min-width: 200px"
                    />
                    <n-input
                      v-else
                      v-model:value="field.value"
                      @update:value="() => clearFieldError(field)"
                      :placeholder="'请输入' + field.key"
                      style="flex: 1; min-width: 200px"
                    />
                    <n-button
                      v-if="isEditing && !field.isFixed"
                      type="error"
                      size="small"
                      @click="removeCustomField(index)"
                    >
                      删除
                    </n-button>
                  </n-space>
                </template>
                <template v-else>
                  <n-text>{{ field.value || '-' }}</n-text>
                </template>
              </n-form-item>
            </div>
          </div>

          <n-space style="margin-left: 10px">
            <n-button
              size="small"
              type="primary"
              @click.stop="addCustomField"
              attr-type="button"
              :disabled="isEditing"
            >
              + 添加计划
            </n-button>
            <n-button
              size="small"
              :type="isEditing ? 'success' : 'warning'"
              @click="toggleEditMode"
              attr-type="button"
              :disabled="hasPendingNewPlan"
            >
              {{ isEditing ? '保存' : '编辑计划' }}
            </n-button>
          </n-space>
        </div>

        <div class="mb-3 h-fit w-full" style="overflow: hidden; width: 100%">
          <div class="font-bold w-full text-[16px] mb-2">模版文件</div>
          <n-form-item label="选择配置" required>
            <n-button quaternary type="info" @click="openConfigModal"> 选择配置 </n-button>
          </n-form-item>
          <n-form-item class="item-wid" label="当前选择的配置项">
            <n-data-table
              style="width: 100%"
              class="!w-full h-fit empty"
              :columns="addColumns as any"
              :data="addFormData.auditConfigurations"
            >
              <template #empty>
                <div style="text-align: center; color: #999; font-size: 14px">暂未选择模版配置项</div>
              </template>
            </n-data-table>
          </n-form-item>
        </div>

        <div class="mb-3">
          <div class="font-bold text-[16px] mb-2">文件上传</div>
          <n-form-item class="item-wid" label="上传待审核文件" required>
            <n-upload
              class="upload-wide"
              style="width: 100%"
              directory-dnd
              :custom-request="handleCustomRequest"
              name="file"
              accept=".pdf,.doc,.docx"
              :max="1"
              @finish="handleUploadFinish"
              @error="handleUploadError"
            >
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
        </div>

        <n-form-item class="w-full flex justify-center" path="tenderType">
          <n-space class="w-fit">
            <n-button @click="cancel">取消</n-button>
            <n-button type="primary" @click="submit">确定</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-modal>

    <n-modal
      v-model:show="showConfigModal"
      @close="configSearch = ''"
      preset="dialog"
      title="选择配置"
      style="width: 600px"
    >
      <n-spin :show="configLoading">
        <n-space vertical>
          <n-input v-model:value="configSearch" placeholder="搜索模版名称" clearable />
          <n-data-table :columns="configColumns as any" :data="filteredConfigList" :bordered="false" />
        </n-space>
      </n-spin>
    </n-modal>
  </div>
  
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NDataTable,
  NSpace,
  NModal,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NP,
  NSpin,
  NPopconfirm,
  useMessage,
  type UploadCustomRequestOptions,
} from 'naive-ui'
import { ref, computed, watch, h } from 'vue'
import { CloudUpload as ArchiveIcon } from '@vicons/ionicons5'
import { http } from '@/utils/http'
import { ContentTypeEnum } from '@/enums/requestEnum'
import { AxiosProgressEvent } from 'axios'
import { getTemplateList, getTemplateSearchList } from '@/api'
import { addTenderData } from '@/api/tenderfiletask'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
  (e: 'submitted'): void
}>()

const message = useMessage()

const showModal = computed({
  get: () => props.show,
  set: (v: boolean) => emit('update:show', v),
})

// 表单及计划字段
const typeOptions = [
  { label: '公开招标', value: '公开招标' },
  { label: '邀请招标', value: '邀请招标' },
  { label: '竞争性磋商文件', value: '竞争性磋商文件' },
  { label: '单一来源采购', value: '单一来源采购' },
  { label: '询价采购', value: '询价采购' },
]

const addFormData = ref<any>({
  auditId: null as null | string | number,
  auditConfigurations: [],
  plan: [] as any[],
  tenderName: '',
  tenderType: '',
  fileUrl: '',
  fileNewName: '',
  fileName: '',
  docId: '',
  questionTotal: 0,
})

const isEditing = ref(false)
const customFields = ref<
  Array<{
    key: string
    value: string | null
    edit: boolean
    isNew?: boolean
    isFixed?: boolean
    showButtons?: boolean
    option?: any[]
    error?: string
  }>
>([
  { key: '招标名称', value: '', edit: true, isNew: false, isFixed: true, showButtons: false },
  { key: '招标编号', value: '', edit: true, isNew: false, isFixed: true, showButtons: false },
  { key: '招标类型', value: null, edit: true, isNew: false, isFixed: true, showButtons: false, option: typeOptions },
  { key: '招标时间', value: '', edit: true, isNew: false, isFixed: true, showButtons: false },
  { key: '项目预算', value: '', edit: true, isNew: false, isFixed: false, showButtons: false },
])

const hasPendingNewPlan = computed(() => customFields.value.some((f) => f.isNew === true))

const addCustomField = () => {
  if (isEditing.value) {
    message.warning('请先保存当前编辑内容，再添加计划')
    return
  }
  customFields.value.push({
    key: '',
    value: '',
    edit: true,
    isNew: true,
    isFixed: false,
    showButtons: true,
  })
}

const removeCustomField = (index: number) => {
  const field = customFields.value[index]
  if (field.isFixed) {
    message.warning('固定字段不可删除')
    return
  }
  customFields.value.splice(index, 1)
  message.success('删除成功')
}

const confirmAdd = (field: any) => {
  if (!field.key || !field.value) {
    message.warning('请填写完整的字段名称和值')
    return
  }
  field.isNew = false
  field.showButtons = true
  field.error = ''
  message.success('添加成功')
}

const toggleEditMode = () => {
  if (!isEditing.value && hasPendingNewPlan.value) {
    message.warning('请先确定或删除正在新增的计划')
    return
  }
  if (isEditing.value) {
    customFields.value.forEach((field) => {
      if (!field.isFixed) {
        field.edit = true
        field.showButtons = false
      }
    })
    const nameField = customFields.value.find((f) => f.key === '招标名称')
    const typeField = customFields.value.find((f) => f.key === '招标类型')
    if (nameField) addFormData.value.tenderName = (nameField.value ?? '') as any
    if (typeField) addFormData.value.tenderType = (typeField.value ?? null) as any
    message.success('保存成功')
  } else {
    customFields.value.forEach((field) => {
      if (!field.isFixed) {
        field.edit = true
        field.showButtons = true
      }
    })
    message.info('进入编辑模式')
  }
  isEditing.value = !isEditing.value
}

const cancelPlan = () => {
  customFields.value = [
    { key: '招标名称', value: '', edit: true, isNew: false, isFixed: true, showButtons: false },
    { key: '招标编号', value: '', edit: true, isNew: false, isFixed: true, showButtons: false },
    { key: '招标类型', value: null, edit: true, isNew: false, isFixed: true, showButtons: false, option: typeOptions },
    { key: '招标时间', value: '', edit: true, isNew: false, isFixed: true, showButtons: false },
    { key: '项目预算', value: '', edit: true, isNew: false, isFixed: false, showButtons: false },
  ]
  isEditing.value = false
}

const clearFieldError = (field: { error?: string }) => {
  if (field.error) field.error = ''
}

const validateRequiredCustomFields = () => {
  customFields.value = customFields.value.filter((field) => {
    const val = field.value
    const empty = val === null || (typeof val === 'string' && val.trim() === '')
    return field.isFixed || !empty
  })
  let valid = true
  customFields.value.forEach((field) => {
    if (field.isFixed) {
      const val = field.value
      const empty = val === null || (typeof val === 'string' && val.trim() === '')
      if (empty) {
        valid = false
        const action = field?.option?.length ? '请选择' : '请输入'
        field.error = `${action}${field.key}`
        field.edit = true
      } else {
        field.error = ''
      }
    } else {
      field.error = ''
    }
  })
  return valid
}

const addColumns = [
  { title: 'ID', key: 'id' },
  { title: '名称', key: 'name' },
  { title: '模版问题数量', key: 'total' },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(row: any) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => handleDelete(row),
          onNegativeClick: () => {},
          positiveText: '确认',
          negativeText: '取消',
        },
        {
          default: () => '删除后将无法恢复，是否确认删除',
          trigger: () =>
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: 'margin-left: 8px',
              },
              { default: () => '删除' },
            ),
        },
      )
    },
  },
]

// 配置模态框逻辑
const showConfigModal = ref(false)
const configSearch = ref('')
const configLoading = ref(false)
const configList = ref<Array<{ id: number | string; name: string; template: string; total?: number }>>([])

const initTemplate = async () => {
  try {
    const res: any = await getTemplateList<any>()
    const arr = Array.isArray(res) ? res : (res?.records ?? res?.list ?? res?.data ?? [])
    configList.value = (arr || []).map((it: any) => ({
      id: it.id ?? it.ID ?? it.templateId ?? it.uid ?? '',
      name: it.name ?? it.templateName ?? it.title ?? '',
      total: it.total ?? it.templateType ?? it.type ?? 0,
    }))
  } catch (e) {
    configList.value = []
    message.error('加载配置失败')
  }
}

const filteredConfigList = computed(() => configList.value)

const configColumns = [
  { title: 'ID', key: 'id' },
  { title: '名称', key: 'name' },
  { title: '模版问题数量', key: 'total' },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render(row: any) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          onClick: () => handleSelectConfig(row),
        },
        { default: () => '选择' },
      )
    },
  },
]

const openConfigModal = async () => {
  showConfigModal.value = true
  configLoading.value = true
  try {
    await initTemplate()
  } finally {
    configLoading.value = false
  }
}

let searchTimer: any = null
let lastKeyword = ''
const doSearch = async (keyword: string) => {
  configLoading.value = true
  try {
    if (!keyword) {
      await initTemplate()
      return
    }
    if (keyword === lastKeyword) return
    lastKeyword = keyword
    const res: any = await getTemplateSearchList<any>({ keyword })
    const arr = Array.isArray(res) ? res : (res?.records ?? res?.list ?? res?.data ?? [])
    configList.value = (arr || []).map((it: any) => ({
      id: it.id ?? it.ID ?? it.templateId ?? it.uid ?? '',
      name: it.name ?? it.templateName ?? it.title ?? '',
      total: it.total ?? it.templateType ?? it.type ?? 0,
    }))
  } finally {
    configLoading.value = false
  }
}

watch(
  () => configSearch.value,
  (val) => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      void doSearch(val.trim())
    }, 400)
  },
)

const handleSelectConfig = (row: { id: number | string; name: string; total: number }) => {
  addFormData.value.auditConfigurations[0] = row
  addFormData.value.auditId = row.id
  addFormData.value.questionTotal = row.total || 0
  message.success('已选择配置')
  showConfigModal.value = false
}

const fileList = ref<any[]>([])

const handleDelete = (row: any) => {
  const index = addFormData.value.auditConfigurations.findIndex((item: any) => item.id === row.id)
  if (index > -1) {
    addFormData.value.auditConfigurations.splice(index, 1)
  }
}

const cancel = () => {
  showModal.value = false
  addFormData.value = {
    tenderName: '',
    tenderType: '',
    occurrenceTime: '',
    auditId: null,
    auditConfigurations: [],
    plan: [],
    fileUrl: '',
    fileNewName: '',
    docId: '',
    questionTotal: 0,
    fileName: '',
  }
  cancelPlan()
  fileList.value = []
}

const submit = async () => {
  const customOk = validateRequiredCustomFields()
  if (!customOk) {
    message.error('请完善必填的采购计划字段')
    return
  }
  if (addFormData.value.auditId === null) {
    message.error('请至少选择一个审核配置项')
    return
  }
  if (!fileList.value.length) {
    message.error('请上传待审核文件')
    return
  }
  const planArray = customFields.value
    .filter((field) => field.key && field.value)
    .map((field) => ({ key: field.key, value: field.value }))
  addFormData.value.plan = planArray
  addFormData.value.tenderName = customFields.value.find((field) => field.key === '招标名称')?.value
  addFormData.value.tenderType = customFields.value.find((field) => field.key === '招标类型')?.value

  const { auditConfigurations: _omitAuditConfigs, ...rest } = addFormData.value
  const submitData = { ...rest }
  try {
    await addTenderData<any>(submitData)
    message.success('新增成功')
    showModal.value = false
    cancel()
    emit('submitted')
  } catch (error) {
    message.error('新增失败')
  }
}

const fileUrl = import.meta.env.VITE_FILE_URL
const handleCustomRequest = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  const formData = new FormData()
  formData.append('file', file.file as File)
  http
    .request<any>({
      url: fileUrl,
      method: 'POST',
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      data: formData,
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (e.total) {
          const percent = Math.round((e.loaded * 100) / e.total)
          onProgress?.({ percent })
        }
      },
    })
    .then((data: any) => {
      onFinish?.()
      handleUploadFinish({ code: 200, msg: 'success', data })
    })
    .catch((error: any) => {
      onError?.()
      const resp = error?.data || error?.response?.data || { code: -1, msg: 'upload error' }
      handleUploadError({ response: resp })
    })
}

const handleUploadFinish = (res: any) => {
  if (res.code === 200) {
    message.success('上传成功')
    fileList.value.push(res.data)
    const data = res.data.data
    addFormData.value.fileName = data.fileName
    addFormData.value.fileUrl = data.fileUrl
    addFormData.value.fileNewName = data.fileNewName
    addFormData.value.docId = data.md5
  }
}

const handleUploadError = (res: any) => {
  console.log(res.response)
  message.error('上传失败，请重试!错误原因：' + res.response)
}
</script>

<style scoped>
.field-space {
  width: 100%;
  max-width: 720px;
}
.upload-wide :deep(.n-upload-dragger) {
  width: 100%;
  min-height: 140px;
}
.item-wid :deep(.n-form-item-blank) {
  width: 100%;
}
.empty :deep(.n-data-table-empty) {
  padding: 20px;
}
</style>

