import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // Landing Layout (for public pages)
  {
    path: "/",
    component: () => import("@/layouts/LandingLayout.vue"),
    children: [
      {
        path: '',
        name: "landingPage",
        component: () => import("@/views/LandingPage.vue"),
      },
      {
        path: 'aboutUsView',
        name: "aboutUsView",
        component: () => import("@/views/AboutUsView.vue"),
      },
      {
        path: 'contactUsView',
        name: "contactUsView",
        component: () => import("@/views/ContactUsView.vue"),
      },
      {
        path: 'register',
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
      },
      {
        path: 'login',
        name: "login",
        component: () => import("@/views/LoginView.vue"),
      }
    ]
  },

  // Main Layout (for authenticated users)
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: 'home',
        name: "home",
        component: () => import("@/views/user/HomePage.vue"),
      },
      {
        path: 'category/:catName',
        name: 'categoryView',
        component: () => import('@/views/user/CategoryView.vue')
      },
      {
        path: 'profile',
        name: "profileView",
        component: () => import("@/views/user/ProfileView.vue"),
      }
    ],
  },

  // Admin Layout
  {
    path: "/adminView",
    component: () => import("@/layouts/AdminLayout.vue"),
    children: [
      {
        path: '',
        name: "adminView",
        component: () => import("@/views/admin/adminView.vue"),
      }
    ],
  },

  // Standalone Routes (no layout needed)
  {
    name: "productView",
    path: "/product/:productId",
    component: () => import("@/views/user/ProductView.vue"),
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

  // Catch all
  { path: '/:catchAll(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
