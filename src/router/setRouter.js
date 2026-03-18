// import dynamicRouterList from "./dynamicRouter"; // 待特殊处理的路由配置表
import routes404 from "./routes404"; // 404页面路由
// 使用后端返回的权限列表拍平后的结果和标识找到动态路由（可以一次性塞入所有的动态路由）
export const useMarkFindAllRouter = () => {
  // const modules = import.meta.glob("../views/**/*.vue");
  let allList = [];
  const flatPermissionList = JSON.parse(
    localStorage.getItem("agiles_router")
  ); // 后端返回的权限列表拍平后的结果
  console.log(
    "%c【" + "flatPermissionList拍平" + "】打印",
    "color:#fff;background:#0f0",
    flatPermissionList
  );
  flatPermissionList.forEach((ele) => {
    if (ele.component != "") {
      let dynamicJavaRouter = {
        // ...ele,
        path: ele.path, // 注意path要使用后端返回的导航栏的path
        parentId: 0,
        name: ele.name, // 注意自定义组件的name 保持不重复 判断是否存在路由时候用
        navShow: ele.navShow == 1 ? true : false,
        isInnerPage: ele.isInnerPage == 1 ? true : false,
        isSystem: ele.isSystem == 1 ? true : false,
        isTool: ele.isTool == 1 ? true : false,
        meta: { title: ele.metaVO }, // 配置基础meta
        component: ele.component, // 注意component要使用import.meta.glob的路径
      }; // 组装动态路由
      allList.push(dynamicJavaRouter);
    }
  });
  // console.log("allList", allList);
  // 如果你的meta不需要特殊处理就不需要此逻辑
  // for (let index = 0; index < dynamicRouterList.length; index++) {
  //   const element = dynamicRouterList[index];
  //   for (let i = 0; i < allList.length; i++) {
  //     const ele = allList[i];
  //     if (ele.flag === element.markId) {
  //       ele.meta = element.meta; // 根据标识和待特殊处理的路由配置表 匹配 找到后赋值特殊的meta信息
  //     }
  //   }
  // }

  return allList;
};
// 添加动态路由
export const setComponent = (router) => {
  const model = import.meta.glob("../views/**/*.vue");
  const dynamicRoutesAllList = useMarkFindAllRouter(); // 根据标识或者路径找到对应动态路由
  // console.log("添加动态路由", "dynamicRoutesAllList", dynamicRoutesAllList);
  dynamicRoutesAllList.forEach((route) => {
    router.addRoute({
      ...route,
      meta: { ...route.meta, isDynamic: true }, // 标记动态路由
      component: model[`../views/${route.component}`],
    });
    // router.options.routes.push(dynamicRoutes)
  });
  console.log(router.getRoutes());
  // 添加404路由
  routes404.forEach((ele) =>
    router.addRoute({
      ...ele,
      meta: { ...ele.meta, isDynamic: true }, // 标记动态路由
    })
  );
  return true;
};
