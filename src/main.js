import { createApp } from 'vue'
import './input.css'
import App from './App.vue'

// Import Chart.js globally (optional)
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

createApp(App).mount('#app')