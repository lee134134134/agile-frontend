import { resetDynamicRoutes } from "@/utils/routeManager"; // 删除动态路由方法
import { createRouter, createWebHashHistory } from "vue-router";
import staticRoutesDefault from "./staticRoutesDefault";
import constantRoutes from "./constantRoutes";
import { useUserStore } from "@/stores/user";

import { setComponent } from "./setRouter"; // 动态路由设置方法

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutesDefault, ...constantRoutes], // 初始这里仅有/login /详情 等基础路由 不包含动态路由 不包含404类路由
});

router.beforeEach(async (to, _from, next) => {
  const { userStore } = useUserStore();

  // -------------------------动态路由判断逻辑-------------------------
  // 退出到登录页 时候需要清除动态路由，否则下一个用户可以通过地址栏拼接方式 使用上一个用户的路由 菜单权限不严谨
  if (to.path === "/login" || to.name === "login" || to.path === "/") {
    // 清理动态路由
    resetDynamicRoutes(router);
  }
  // try {
  //   // 1. 检查路由是否存在
  //   const routeExists = router.hasRoute(to.name || to.path);
  //   console.log(
  //     "%c【" + "检查路由是否存在" + "】打印",
  //     "color:#fff;background:#0f0",
  //     to.name,
  //     to.path,
  //     routeExists
  //   );

  // 2. 不存在的话去添加
  // if (!routeExists) {
  //   // 添加动态路由
  //   const addIsSuccessful = setComponent(router);
  //   if (addIsSuccessful) {
  //     return next({ ...to, replace: true });
  //   }
  // }
  // } catch (error) {
  //   console.log(error);
  // }
  // -------------------------动态路由判断逻辑-------------------------

  // 正常的其他逻辑
  // const token = localStorage.getItem("agiles_token") || "";
  // let permissionList = [...userStore.routers.map((item) => item.path)];
  // if (!token) {
  //   next("/login");
  // } else {
  //   if (permissionList.includes(to.path)) {
  //     next();
  //   } else {
  //     next("/403");
  //   }
  // }
});

export default router;
