import { createRouter, createWebHistory } from "vue-router";
import { watch } from "vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { guestOnly: true }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: { guestOnly: true }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/missing",
    name: "MissingItems",
    component: () => import("../views/ItemsList.vue"),
    meta: { requiresAuth: true, defaultTab: "missing" }
  },
  {
    path: "/found",
    name: "FoundItems",
    component: () => import("../views/ItemsList.vue"),
    meta: { requiresAuth: true, defaultTab: "found" }
  },
  {
    path: "/report-missing",
    name: "ReportMissing",
    component: () => import("../views/ReportItem.vue"),
    meta: { requiresAuth: true, type: "missing" }
  },
  {
    path: "/report-found",
    name: "ReportFound",
    component: () => import("../views/ReportItem.vue"),
    meta: { requiresAuth: true, type: "found" }
  },
  {
    path: "/item/:type/:id",
    name: "ItemDetail",
    component: () => import("../views/ItemDetail.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("../views/Notifications.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("../views/Chat.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/calendar",
    name: "ActivityCalendar",
    component: () => import("../views/ActivityCalendar.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: () => import("../views/AdminDashboard.vue"),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // Catch all / 404 redirect
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: "smooth" };
  }
});

// Guard checks
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Await auth loading initialization
  if (authStore.loading) {
    await new Promise((resolve) => {
      const stop = watch(
        () => authStore.loading,
        (isLoading) => {
          if (!isLoading) {
            stop();
            resolve();
          }
        },
        { immediate: true }
      );
    });
  }

  const user = authStore.currentUser;

  // Rule 1: Requires Auth
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  // Rule 2: Guest Only (Login/Register)
  if (to.matched.some(record => record.meta.guestOnly) && user) {
    return next({ name: "Dashboard" });
  }

  // Rule 3: Admin Only
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!user || user.role !== "admin") {
      authStore.logout(); // Fail-safe
      return next({ name: "Login" });
    }
  }

  next();
});

export default router;
