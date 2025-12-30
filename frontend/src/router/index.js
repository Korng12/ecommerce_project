import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "landingPage",
    path: "/",
    component: () => import("@/views/LandingPage.vue"),
  },
  {
    name:'HomePage',
    path:'/HomePage',
    component:()=>import('@/views/user/HomePage.vue'),
  },
  {
    name: "productView",
    path: "/product/productView/:productId",
    component: () => import("@/views/user/ProductView.vue"),
  },
  {
    name: "aboutUsView",
    path: "/aboutUsView",
    component: () => import("@/views/AboutUsView.vue"),
  },
  {
    name: "contactUsView",
    path: "/contactUsView",
    component: () => import("@/views/ContactUsView.vue"),
  },
      {
      path: '/category/:catName',
      name: 'categoryView',
      component: ()=>import('@/views/user/CategoryView.vue')
    },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
