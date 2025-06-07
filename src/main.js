import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'

import App from './App.vue'
//import { createToast } from '@/components/ui/toast/use-toast'

const app = createApp(App)
//app.use(createToast())
app.use(router)

app.mount('#app')


