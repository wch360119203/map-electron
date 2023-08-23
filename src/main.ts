import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import { router } from '@/render'
import '@/assets/style.scss'
import { createPinia } from 'pinia'
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.mount('#app')
