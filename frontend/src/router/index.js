import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name:'landingPage',
    path:'/',
    component:()=> import('@/views/LandingPage.vue')
  },
  {
    name:'productView',
    path:'/product/productView/:productId',
    component:()=>import('@/views/ProductView.vue')
  },{
    name:'aboutUsView',
    path:'/aboutUsView',
    component:()=>import('@/views/AboutUsView.vue')
  },
  {
    name:'contactUsView',
    path:'/contactUsView',
    component:()=>import('@/views/ContactUsView.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
