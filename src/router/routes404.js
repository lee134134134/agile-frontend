const constantRoutes = [
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/common/404.vue"),
    meta: {
      title: "404",
      inlayout: false
    }
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/common/403.vue"),
    meta: {
      title: "403",
      inlayout: false
    }
  },
  {
    path: "/:pathMatch(.*)",
    name: "error",
    redirect: "/home",
    meta: {
      title: "错误",
      inlayout: false
    }
  }
]
export default constantRoutes

