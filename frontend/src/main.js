import './assets/main.css'
import './input.css'

import 'primeicons/primeicons.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router  from './router'
import axios from 'axios'

// Configure axios to always include credentials (cookies)
axios.defaults.withCredentials = true

import { faUser, faHome, faEnvelope,faSearch,faShoppingCart,faXmark,faLocation,faPhone} from '@fortawesome/free-solid-svg-icons'
import { faFacebook,faInstagram,faTiktok,faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Chart, registerables } from 'chart.js'
import { useWishlist } from './stores/wishlist'

Chart.register(...registerables)
library.add(faUser, faHome, faEnvelope,faSearch,faShoppingCart,faFacebook,faInstagram,faTiktok,faXTwitter,faXmark)
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')

// Load wishlist from localStorage after app is mounted
const wishlistStore = useWishlist()
wishlistStore.loadFromLocalStorage()
