import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ROLES } from "@/constants/roles";
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/LandingLayout.vue"),
    children: [
      {
        path: "",
        name: "landingPage",
        component: () => import("@/views/LandingPage.vue"),
      },
      {
        path: "aboutUsView",
        name: "aboutUsView",
        component: () => import("@/views/AboutUsView.vue"),
      },
      {
        path: "contactUsView",
        name: "contactUsView",
        component: () => import("@/views/ContactUsView.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/views/RegisterView.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("@/views/LoginView.vue"),
      },
    ],
  },
  {
    path: "/app",
    component: () => import("@/layouts/MainLayout.vue"),
    meta: { requiresAuth: true, ROLES: [ROLES.USER, ROLES.ADMIN] },
    children: [
      {
        path: '', name: "home",component: () => import("@/views/user/HomePage.vue"), 
      },
      {
        path: "category/:catName",
        name: "categoryView",
        component: () => import("@/views/user/CategoryView.vue"),
      },
    ],
  },
  {
    path: "/adminView",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, requiredRole: ROLES.ADMIN },
    children: [
      {
        path: "",
        name: "adminView",
        component: () => import("@/views/admin/adminView.vue"),
      },
    ],
  },
  {
    name: "productView",
    path: "/product/productView/:productId",
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
  {
    name: "paymentSuccess",
    path: "/payment-success",
    component: () => import("@/views/user/PaymentSuccessView.vue"),
  },
  {
    name: "categoryView",
    path: "/product/categoryView/:catName",
    component: () => import("@/views/user/CategoryView.vue"),
  },
  { path: "/:catchAll(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.checkedAuth) {
    await authStore.fetchCurrentUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }

  if (to.meta.requiredRole && authStore.user?.roleId !== to.meta.requiredRole) {
    return { name: "forbidden" };
  }
});

export default router;
