import './assets/main.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)

app.mount('#app')
