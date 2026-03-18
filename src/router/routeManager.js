// 新增清除动态路由方法
import Cookies from "js-cookie";
export const resetDynamicRoutes = (router) => {
  // 清除所有动态路由
  router.getRoutes().forEach((route) => {
    if (route.meta?.isDynamic) {
      router.removeRoute(route.name);
      Cookies.remove("agiles_token");
      Cookies.remove("agiles_tokenType");
      localStorage.removeItem("agiles_token");
      localStorage.removeItem("agiles_tokenType");
      localStorage.removeItem("agiles_user");
      localStorage.removeItem("agiles_userInfo");
      localStorage.removeItem("agiles_router");
      localStorage.removeItem("agiles_menuList");
    }
  });

  // 清除404路由（根据实际情况调整）
  // router.removeRoute('error')
  // router.removeRoute('404')
  // router.removeRoute('403')
};
