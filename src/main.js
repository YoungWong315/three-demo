import { createApp } from 'vue'
import App from './App.vue'

import 'reset-css/reset.css'
// import 'element-plus/dist/index.css'
import store from '@/store'
import router from '@/router/index'
import moment from 'moment'
import '@/modules/glMatrix'

const app = createApp(App)

// 全局注册全部 element-plus icon
import * as ElIconModules from '@element-plus/icons-vue'
for (let icon in ElIconModules) {
  app.component(icon, ElIconModules[icon])
}

app.config.globalProperties.$moment = moment

app.use(router)
app.use(store)
app.mount('#app')
