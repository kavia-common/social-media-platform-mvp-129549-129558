import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Preload auth state/token-based user
const auth = useAuthStore()
if (auth.token) {
  auth.fetchMe().finally(() => app.mount('#app'))
} else {
  app.mount('#app')
}
