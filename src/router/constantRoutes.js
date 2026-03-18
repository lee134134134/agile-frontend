const constantRoutes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login/index.vue"),
    meta: {
      inlayout: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/index.vue"),
    meta: {
      title: "登录",
      inlayout: false,
    },
  }
];
export default constantRoutes;
