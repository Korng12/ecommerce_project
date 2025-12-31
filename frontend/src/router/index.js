import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // {
  //   name: "landingPage",
  //   path: "/",
  //   component: () => import("@/views/LandingPage.vue"),
  // },
  {
    path:"/",
    component: () => import("@/layouts/LandingLayout.vue"),
    children:[
      {
        path:'', name: "landingPage",component: () => import("@/views/LandingPage.vue"),
      },
      {
        path: 'aboutUsView', name: "aboutUsView",component: () => import("@/views/AboutUsView.vue"),

      },
      {
        path: 'contactUsView', name: "contactUsView",component: () => import("@/views/ContactUsView.vue"),
      },
      {
        path: 'register', name: "register",component: () => import("@/views/RegisterView.vue"),
        
      },
      {
        path: 'login', name: "login",component: () => import("@/views/LoginView.vue"),
      } 
    ]  
  },
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
    {
        path: '', name: "home",component: () => import("@/views/user/HomePage.vue"),
 
      },
      {
        path: 'category/:catName',
        name: 'categoryView',
        component: ()=>import('@/views/user/CategoryView.vue')
      }
      ,{
        path: 'aboutUsView', name: "aboutUsView",component: () => import("@/views/AboutUsView.vue"),
      },
      {
        path: 'contactUsView', name: "contactUsView",component: () => import("@/views/ContactUsView.vue"),
      }
    ],
  },
  {
    path: "/adminView",
    component: () => import("@/layouts/AdminLayout.vue"),
    children: [
      {
        path: '', name: "adminView",component: () => import("@/views/admin/adminView.vue"),
      }
    ],
  },
  // {
  //   name:'HomePage',
  //   path:'/HomePage',
  //   component:()=>import('@/views/user/HomePage.vue'),
  // },
  {
    name: "productView",
    path: "/product/productView/:productId",
    component: () => import("@/views/user/ProductView.vue"),
  },
  // {
  //   name: "aboutUsView",
  //   path: "/aboutUsView",
  //   component: () => import("@/views/AboutUsView.vue"),
  // },
  // {
  //   name: "contactUsView",
  //   path: "/contactUsView",
  //   component: () => import("@/views/ContactUsView.vue"),
  // },
    //   {
    //   path: '/category/:catName',
    //   name: 'categoryView',
    //   component: ()=>import('@/views/user/CategoryView.vue')
    // },
  {
    name: "cartView",
    path: "/cartView",
    component: () => import("@/views/user/CartView.vue"),
  },
  {
    name: "checkoutView",
    path: "/checkoutView",
    component: () => import("@/views/user/CheckoutView.vue"),
  },
  {
    name: "categoryView",
    path: "/product/categoryView/:catName",
    component: () => import("@/views/user/CategoryView.vue"),
  },
  { path: '/:catchAll(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
