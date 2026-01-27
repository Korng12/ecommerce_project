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
        path: "aboutus",
        name: "aboutUsView",
        component: () => import("@/views/AboutUsView.vue"),
      },
      {
        path: "contactus",
        name: "contactUsView",

        component: () => import("@/views/ContactUsView.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/components/auth/Register.vue"),
        // component: () => import("@/views/RegisterView.vue"),
      },
      {
        path: "login",
        name: "login",
        // component: () => import("@/views/LoginView.vue"),
        component: () => import("@/components/auth/Login.vue"),
      },
    ],
  },
  {
    path: "/app",
    component: () => import("@/layouts/MainLayout.vue"),

    meta: { requiresAuth: true, ROLES: [ROLES.USER, ROLES.ADMIN] },
    children: [
      {
        path: '', name: "home", component: () => import("@/views/user/HomePage.vue"),
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
        path: '',
        name: 'adminDashboard',
        component: () => import("@/components/admin/DashboardTab.vue"),
      },
      {
        path: 'dashboard',
        name: 'adminDashboard',
        component: () => import("@/components/admin/DashboardTab.vue"),
      },
      {
        path: 'users',
        name: 'adminUsers',
        component: () => import("@/components/admin/UsersTab.vue"),
      },
      {
        path: 'products',
        name: 'adminProducts',
        component: () => import("@/components/admin/Products.vue"),
      },
      {
        path: 'categories',
        name: 'adminCategories',
        component: () => import("@/components/admin/CategoriesTab.vue"),
      },
      {
        path: 'orders',
        name: 'adminOrders',
        component: () => import("@/components/admin/OrdersTab.vue"),
      },
      // {
      //   path: 'promotions',
      //   name: 'adminPromotions',
      //   component: () => import("@/components/admin/"),
      // },
      {
        path: 'notifications',
        name: 'adminNotifications',
        component: () => import("@/components/admin/NotificationsTab.vue"),
      },
      {
        path: 'analytics',
        name: 'adminAnalytics',
        component: () => import("@/components/admin/AnalyticsTab.vue"),
      },
      {
        path: 'settings',
        name: 'adminSettings',
        component: () => import("@/components/admin/SettingsTab.vue"),
      }

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
    meta: { requiresAuth: true, requiredRole: ROLES.USER },
  },
  {
    name: "checkoutView",
    path: "/checkoutView",
    component: () => import("@/views/user/CheckoutView.vue"),
    meta: { requiresAuth: true, requiredRole: ROLES.USER },
  },
  {
    name: "paymentSuccess",
    path: "/payment-success",
    component: () => import("@/views/user/PaymentSuccessView.vue"),
  },
  {
    name: "receipt",
    path: "/receipt/:orderId",
    component: () => import("@/components/order/Receipt.vue"),
  },
  // {
  //   name: "categoryView",
  //   path: "/product/categoryView/:catName",
  //   component: () => import("@/views/user/CategoryView.vue"),
  // },
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
