import './assets/main.css'
<<<<<<< HEAD
import './input.css'

=======

import 'primeicons/primeicons.css'
>>>>>>> main
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router  from './router'

import { faUser, faHome, faEnvelope,faSearch,faShoppingCart,faXmark} from '@fortawesome/free-solid-svg-icons'
import { faFacebook,faInstagram,faTiktok,faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
library.add(faUser, faHome, faEnvelope,faSearch,faShoppingCart,faFacebook,faInstagram,faTiktok,faXTwitter,faXmark)
const app = createApp(App)
app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
