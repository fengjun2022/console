import '@/scss/main.scss'

import { createApp } from 'vue'
import App from '@/App.vue'
import i18n from '@/i18n'

import {store} from '@/stores'
import router from '@/router'
import { initTheme } from '@/config/theme'

// 在应用启动前初始化主题
initTheme()

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)

app.mount('#app')
