<template>
  <div class="course-management">
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="course" tab="课程管理">
        <div class="course-content">
          <div class="header-actions">
            <n-space>
              <n-button type="primary" @click="openCourseDialog">
                <template #icon>
                  <n-icon><AddOutline /></n-icon>
                </template>
                新增课程
              </n-button>
              <n-input
                v-model:value="courseSearchText"
                placeholder="搜索课程名称"
                clearable
                @input="handleCourseSearch"
              >
                <template #prefix>
                  <n-icon><SearchOutline /></n-icon>
                </template>
              </n-input>
            </n-space>
          </div>

          <n-data-table
            :columns="courseColumns"
            :data="filteredCourseData"
            :pagination="coursePagination"
            :loading="courseLoading"
            striped
            :row-key="(row) => row.id"
          />
        </div>
      </n-tab-pane>

      <n-tab-pane name="book" tab="书籍管理">
        <div class="book-content">
          <div class="header-actions">
            <n-space>
              <n-button type="primary" @click="openBookDialog">
                <template #icon>
                  <n-icon><AddOutline /></n-icon>
                </template>
                新增书籍
              </n-button>
              <n-input
                v-model:value="bookSearchText"
                placeholder="搜索书籍名称"
                clearable
                @input="handleBookSearch"
              >
                <template #prefix>
                  <n-icon><SearchOutline /></n-icon>
                </template>
              </n-input>
            </n-space>
          </div>

          <n-data-table
            :columns="bookColumns"
            :data="filteredBookData"
            :pagination="bookPagination"
            :loading="bookLoading"
            striped
            :row-key="(row) => row.id"
          />
        </div>
      </n-tab-pane>

      <n-tab-pane name="word-audio" tab="单词管理">
        <div class="word-audio-content">
          <div class="header-actions">
            <n-space>
              <n-button type="primary" @click="openWordAudioDialog">
                <template #icon>
                  <n-icon><AddOutline /></n-icon>
                </template>
                新增映射
              </n-button>
              <n-input
                v-model:value="wordAudioSearchText"
                placeholder="搜索单词"
                clearable
                @input="handleWordAudioSearch"
              >
                <template #prefix>
                  <n-icon><SearchOutline /></n-icon>
                </template>
              </n-input>
            </n-space>
          </div>

          <n-data-table
            :columns="wordAudioColumns"
            :data="filteredWordAudioData"
            :pagination="wordAudioPagination"
            :loading="wordAudioLoading"
            striped
            :row-key="(row) => row.id"
          />
        </div>
      </n-tab-pane>
    </n-tabs>

    <!-- 课程编辑对话框 -->
    <n-modal
      v-model:show="courseDialogVisible"
      preset="dialog"
      :title="courseDialogTitle"
      :positive-text="courseDialogMode === 'add' ? '新增' : '更新'"
      negative-text="取消"
      @positive-click="handleCourseSubmit"
      @negative-click="closeCourseDialog"
    >
      <n-form
        ref="courseFormRef"
        :model="courseForm"
        :rules="courseRules"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="课程名称" path="name">
          <n-input v-model:value="courseForm.name" placeholder="请输入课程名称" />
        </n-form-item>
        <n-form-item label="课程描述" path="description">
          <n-input
            v-model:value="courseForm.description"
            type="textarea"
            placeholder="请输入课程描述"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </n-form-item>
        <n-form-item label="课程状态" path="status">
          <n-select
            v-model:value="courseForm.status"
            :options="statusOptions"
            placeholder="请选择课程状态"
          />
        </n-form-item>
        <n-form-item label="创建时间" path="createTime">
          <n-date-picker
            v-model:value="courseForm.createTime"
            type="datetime"
            placeholder="请选择创建时间"
          />
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 书籍编辑对话框 -->
    <n-modal
      v-model:show="bookDialogVisible"
      preset="dialog"
      :title="bookDialogTitle"
      :positive-text="bookDialogMode === 'add' ? '新增' : '更新'"
      negative-text="取消"
      @positive-click="handleBookSubmit"
      @negative-click="closeBookDialog"
    >
      <n-form
        ref="bookFormRef"
        :model="bookForm"
        :rules="bookRules"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="书籍名称" path="name">
          <n-input v-model:value="bookForm.name" placeholder="请输入书籍名称" />
        </n-form-item>
        <n-form-item label="作者" path="author">
          <n-input v-model:value="bookForm.author" placeholder="请输入作者" />
        </n-form-item>
        <n-form-item label="ISBN" path="isbn">
          <n-input v-model:value="bookForm.isbn" placeholder="请输入ISBN" />
        </n-form-item>
        <n-form-item label="出版社" path="publisher">
          <n-input v-model:value="bookForm.publisher" placeholder="请输入出版社" />
        </n-form-item>
        <n-form-item label="出版日期" path="publishDate">
          <n-date-picker
            v-model:value="bookForm.publishDate"
            type="date"
            placeholder="请选择出版日期"
          />
        </n-form-item>
        <n-form-item label="书籍状态" path="status">
          <n-select
            v-model:value="bookForm.status"
            :options="statusOptions"
            placeholder="请选择书籍状态"
          />
        </n-form-item>
        <n-form-item label="所属课程" path="courseId">
          <n-select
            v-model:value="bookForm.courseId"
            :options="courseOptions"
            placeholder="请选择所属课程"
            clearable
          />
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 单词音频映射对话框 -->
    <n-modal
      v-model:show="wordAudioDialogVisible"
      preset="dialog"
      :title="wordAudioDialogTitle"
      :positive-text="wordAudioDialogMode === 'add' ? '新增' : '更新'"
      negative-text="取消"
      @positive-click="handleWordAudioSubmit"
      @negative-click="closeWordAudioDialog"
    >
      <n-form
        ref="wordAudioFormRef"
        :model="wordAudioForm"
        :rules="wordAudioRules"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="单词" path="word">
          <n-auto-complete
            v-model:value="wordAudioForm.word"
            :options="wordOptions"
            placeholder="请输入单词"
            @select="handleWordSelect"
          />
        </n-form-item>
        <n-form-item label="音频URL" path="audioUrl">
          <n-input v-model:value="wordAudioForm.audioUrl" placeholder="请输入音频URL" />
        </n-form-item>
        <n-form-item label="所属书籍" path="bookId">
          <n-select
            v-model:value="wordAudioForm.bookId"
            :options="bookOptions"
            placeholder="请选择所属书籍"
            clearable
          />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import {
  NTabs,
  NTabPane,
  NDataTable,
  NButton,
  NSpace,
  NInput,
  NIcon,
  NModal,
  NForm,
  NFormItem,
  NSelect,
  NDatePicker,
  NAutoComplete,
  useMessage,
  type DataTableColumns,
  type FormInst,
  type FormRules
} from 'naive-ui'
import { AddOutline, SearchOutline, EditOutline, TrashOutline } from '@vicons/ionicons5'
import {
  addNewBooks,
  selectBooks,
  delBookAndCourseAndWord,
  updateBooks,
  getSelectBooks,
  addNewCourses,
  selectCourse,
  delCourseAndWord,
  getCourseBooks,
  addWords,
  getWordsAll,
  delWord,
  updateWord
} from '@/api'

const message = useMessage()

// 活动标签页
const activeTab = ref('course')

// 课程相关状态
const courseData = ref<any[]>([])
const courseLoading = ref(false)
const courseSearchText = ref('')
const courseDialogVisible = ref(false)
const courseDialogMode = ref<'add' | 'edit'>('add')
const courseFormRef = ref<FormInst>()

const courseForm = reactive({
  id: '',
  name: '',
  description: '',
  status: 1,
  createTime: null
})

const courseRules: FormRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入课程描述', trigger: 'blur' }],
  status: [{ required: true, type: 'number', message: '请选择课程状态', trigger: 'change' }]
}

const coursePagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    coursePagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    coursePagination.pageSize = pageSize
    coursePagination.page = 1
  }
})

// 书籍相关状态
const bookData = ref<any[]>([])
const bookLoading = ref(false)
const bookSearchText = ref('')
const bookDialogVisible = ref(false)
const bookDialogMode = ref<'add' | 'edit'>('add')
const bookFormRef = ref<FormInst>()

const bookForm = reactive({
  id: '',
  name: '',
  author: '',
  isbn: '',
  publisher: '',
  publishDate: null,
  status: 1,
  courseId: null
})

const bookRules: FormRules = {
  name: [{ required: true, message: '请输入书籍名称', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }]
}

const bookPagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    bookPagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    bookPagination.pageSize = pageSize
    bookPagination.page = 1
  }
})

// 单词音频映射相关状态
const wordAudioData = ref<any[]>([])
const wordAudioLoading = ref(false)
const wordAudioSearchText = ref('')
const wordAudioDialogVisible = ref(false)
const wordAudioDialogMode = ref<'add' | 'edit'>('add')
const wordAudioFormRef = ref<FormInst>()

const wordAudioForm = reactive({
  id: '',
  word: '',
  audioUrl: '',
  bookId: null
})

const wordAudioRules: FormRules = {
  word: [{ required: true, message: '请输入单词', trigger: 'blur' }],
  audioUrl: [{ required: true, message: '请输入音频URL', trigger: 'blur' }]
}

const wordAudioPagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    wordAudioPagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    wordAudioPagination.pageSize = pageSize
    wordAudioPagination.page = 1
  }
})

// 选项数据
const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const courseOptions = computed(() => {
  return courseData.value.map(course => ({
    label: course.name,
    value: course.id
  }))
})

const bookOptions = computed(() => {
  return bookData.value.map(book => ({
    label: book.name,
    value: book.id
  }))
})

const wordOptions = ref<Array<{ label: string; value: string }>>([])

// 过滤数据
const filteredCourseData = computed(() => {
  if (!courseSearchText.value) return courseData.value
  return courseData.value.filter(course =>
    course.name.toLowerCase().includes(courseSearchText.value.toLowerCase())
  )
})

const filteredBookData = computed(() => {
  if (!bookSearchText.value) return bookData.value
  return bookData.value.filter(book =>
    book.name.toLowerCase().includes(bookSearchText.value.toLowerCase())
  )
})

const filteredWordAudioData = computed(() => {
  if (!wordAudioSearchText.value) return wordAudioData.value
  return wordAudioData.value.filter(item =>
    item.word.toLowerCase().includes(wordAudioSearchText.value.toLowerCase())
  )
})

// 表格列定义
const courseColumns: DataTableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '课程名称',
    key: 'name',
    sorter: 'default'
  },
  {
    title: '课程描述',
    key: 'description',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(
        'span',
        {
          style: {
            color: row.status === 1 ? '#18a058' : '#d03050'
          }
        },
        row.status === 1 ? '启用' : '禁用'
      )
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    sorter: 'default'
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => editCourse(row)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => deleteCourseItem(row.id)
            },
            { default: () => '删除' }
          )
        ]
      })
    }
  }
]

const bookColumns: DataTableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '书籍名称',
    key: 'name',
    sorter: 'default'
  },
  {
    title: '作者',
    key: 'author'
  },
  {
    title: 'ISBN',
    key: 'isbn'
  },
  {
    title: '出版社',
    key: 'publisher'
  },
  {
    title: '出版日期',
    key: 'publishDate'
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(
        'span',
        {
          style: {
            color: row.status === 1 ? '#18a058' : '#d03050'
          }
        },
        row.status === 1 ? '启用' : '禁用'
      )
    }
  },
  {
    title: '所属课程',
    key: 'courseName'
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => editBook(row)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => deleteBookItem(row.id)
            },
            { default: () => '删除' }
          )
        ]
      })
    }
  }
]

const wordAudioColumns: DataTableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '单词',
    key: 'word',
    sorter: 'default'
  },
  {
    title: '音频URL',
    key: 'audioUrl',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '所属书籍',
    key: 'bookName'
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => editWordAudio(row)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => deleteWordAudioItem(row.id)
            },
            { default: () => '删除' }
          )
        ]
      })
    }
  }
]

// 对话框标题计算属性
const courseDialogTitle = computed(() => {
  return courseDialogMode.value === 'add' ? '新增课程' : '编辑课程'
})

const bookDialogTitle = computed(() => {
  return bookDialogMode.value === 'add' ? '新增书籍' : '编辑书籍'
})

const wordAudioDialogTitle = computed(() => {
  return wordAudioDialogMode.value === 'add' ? '新增单词音频映射' : '编辑单词音频映射'
})

// 课程相关方法
const loadCourseData = async () => {
  courseLoading.value = true
  try {
    const response = await selectCourse<any>({})
    if (response.code === 200) {
      courseData.value = response.data || []
    } else {
      message.error(response.msg || '加载课程数据失败')
    }
  } catch (error) {
    console.error('加载课程数据失败:', error)
    message.error('加载课程数据失败')
  } finally {
    courseLoading.value = false
  }
}

const openCourseDialog = () => {
  courseDialogMode.value = 'add'
  resetCourseForm()
  courseDialogVisible.value = true
}

const editCourse = (course: any) => {
  courseDialogMode.value = 'edit'
  Object.assign(courseForm, course)
  courseDialogVisible.value = true
}

const closeCourseDialog = () => {
  courseDialogVisible.value = false
  resetCourseForm()
}

const resetCourseForm = () => {
  Object.assign(courseForm, {
    id: '',
    name: '',
    description: '',
    status: 1,
    createTime: null
  })
}

const handleCourseSubmit = async () => {
  try {
    await courseFormRef.value?.validate()
    let response
    if (courseDialogMode.value === 'add') {
      response = await addNewCourses<any>({
        name: courseForm.name,
        description: courseForm.description
      })
      if (response.code === 200) {
        message.success('课程添加成功')
      } else {
        message.error(response.msg || '添加失败')
        return
      }
    } else {
      // 注意：真实API可能不支持更新，这里保留逻辑但可能需要根据实际情况调整
      message.warning('课程更新功能暂未实现')
      return
    }
    closeCourseDialog()
    loadCourseData()
  } catch (error) {
    console.error('课程操作失败:', error)
    message.error('操作失败')
  }
}

const deleteCourseItem = async (id: string) => {
  try {
    const response = await delCourseAndWord<any>({ id })
    if (response.code === 200) {
      message.success('课程删除成功')
      loadCourseData()
    } else {
      message.error(response.msg || '删除失败')
    }
  } catch (error) {
    console.error('课程删除失败:', error)
    message.error('删除失败')
  }
}

const handleCourseSearch = () => {
  // 搜索逻辑已在computed中实现
}

// 书籍相关方法
const loadBookData = async () => {
  bookLoading.value = true
  try {
    const response = await selectBooks<any>({})
    if (response.code === 200) {
      bookData.value = response.data || []
    } else {
      message.error(response.msg || '加载书籍数据失败')
    }
  } catch (error) {
    console.error('加载书籍数据失败:', error)
    message.error('加载书籍数据失败')
  } finally {
    bookLoading.value = false
  }
}

const openBookDialog = () => {
  bookDialogMode.value = 'add'
  resetBookForm()
  bookDialogVisible.value = true
}

const editBook = (book: any) => {
  bookDialogMode.value = 'edit'
  Object.assign(bookForm, book)
  bookDialogVisible.value = true
}

const closeBookDialog = () => {
  bookDialogVisible.value = false
  resetBookForm()
}

const resetBookForm = () => {
  Object.assign(bookForm, {
    id: '',
    name: '',
    author: '',
    isbn: '',
    publisher: '',
    publishDate: null,
    status: 1,
    courseId: null
  })
}

const handleBookSubmit = async () => {
  try {
    await bookFormRef.value?.validate()
    let response
    if (bookDialogMode.value === 'add') {
      response = await addNewBooks<any>({
        name: bookForm.name
      })
      if (response.code === 200) {
        message.success('书籍添加成功')
      } else {
        message.error(response.msg || '添加失败')
        return
      }
    } else {
      response = await updateBooks<any>({
        id: bookForm.id,
        name: bookForm.name
      })
      if (response.code === 200) {
        message.success('书籍更新成功')
      } else {
        message.error(response.msg || '更新失败')
        return
      }
    }
    closeBookDialog()
    loadBookData()
  } catch (error) {
    console.error('书籍操作失败:', error)
    message.error('操作失败')
  }
}

const deleteBookItem = async (id: string) => {
  try {
    const response = await delBookAndCourseAndWord<any>({ id })
    if (response.code === 200) {
      message.success('书籍删除成功')
      loadBookData()
    } else {
      message.error(response.msg || '删除失败')
    }
  } catch (error) {
    console.error('书籍删除失败:', error)
    message.error('删除失败')
  }
}

const handleBookSearch = () => {
  // 搜索逻辑已在computed中实现
}

// 单词音频映射相关方法
const loadWordAudioData = async () => {
  wordAudioLoading.value = true
  try {
    const response = await getWordsAll<any>({})
    if (response.code === 200) {
      wordAudioData.value = response.data || []
    } else {
      message.error(response.msg || '加载单词数据失败')
    }
  } catch (error) {
    console.error('加载单词数据失败:', error)
    message.error('加载单词数据失败')
  } finally {
    wordAudioLoading.value = false
  }
}

const openWordAudioDialog = () => {
  wordAudioDialogMode.value = 'add'
  resetWordAudioForm()
  wordAudioDialogVisible.value = true
}

const editWordAudio = (wordAudio: any) => {
  wordAudioDialogMode.value = 'edit'
  Object.assign(wordAudioForm, wordAudio)
  wordAudioDialogVisible.value = true
}

const closeWordAudioDialog = () => {
  wordAudioDialogVisible.value = false
  resetWordAudioForm()
}

const resetWordAudioForm = () => {
  Object.assign(wordAudioForm, {
    id: '',
    word: '',
    audioUrl: '',
    bookId: null
  })
}

const handleWordAudioSubmit = async () => {
  try {
    await wordAudioFormRef.value?.validate()
    let response
    if (wordAudioDialogMode.value === 'add') {
      response = await addWords<any>({
        word: wordAudioForm.word,
        audioUrl: wordAudioForm.audioUrl,
        bookId: wordAudioForm.bookId
      })
      if (response.code === 200) {
        message.success('单词添加成功')
      } else {
        message.error(response.msg || '添加失败')
        return
      }
    } else {
      response = await updateWord<any>({
        id: wordAudioForm.id,
        word: wordAudioForm.word,
        audioUrl: wordAudioForm.audioUrl,
        bookId: wordAudioForm.bookId
      })
      if (response.code === 200) {
        message.success('单词更新成功')
      } else {
        message.error(response.msg || '更新失败')
        return
      }
    }
    closeWordAudioDialog()
    loadWordAudioData()
  } catch (error) {
    console.error('单词操作失败:', error)
    message.error('操作失败')
  }
}

const deleteWordAudioItem = async (id: string) => {
  try {
    const response = await delWord<any>({ id })
    if (response.code === 200) {
      message.success('单词删除成功')
      loadWordAudioData()
    } else {
      message.error(response.msg || '删除失败')
    }
  } catch (error) {
    console.error('单词删除失败:', error)
    message.error('删除失败')
  }
}

const handleWordAudioSearch = () => {
  // 搜索逻辑已在computed中实现
}

const handleWordSelect = (value: string) => {
  wordAudioForm.word = value
}

// 生命周期
onMounted(() => {
  loadCourseData()
  loadBookData()
  loadWordAudioData()

  // 加载单词选项
  wordOptions.value = [
    { label: 'hello', value: 'hello' },
    { label: 'world', value: 'world' },
    { label: 'apple', value: 'apple' }
  ]
})
</script>

<style scoped>
.course-management {
  padding: 20px;
}

.header-actions {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-content,
.book-content,
.word-audio-content {
  padding: 16px 0;
}
</style>
