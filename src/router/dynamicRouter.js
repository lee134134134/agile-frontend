// 根据标识 找到对应的component（建议使用 markId 标识，而不是路径path，这样现场可以随意变动path名称和层级。只需要标识不变即可）
// 注意这里的路由component和markId，其实是和后端菜单配置表里的值一致；只不过这里都是处理特殊meta值用的

export default [
  // {
  //   path: "/abcd", // 此路径不用，使用动态路径
  //   name: "Abcd", // 此name不用，使用动态name
  //   // markId: '/views/assetManagement/ipManagement/mainSiteManagement/mainSiteAddressApplication/index', // 这里就是后端菜单配置表里的标识 值 即component路径
  //   meta: { title: "菜单标题", inlayout: false, needAside: false }, // 目的获取特殊的meta信息
  //   component: () =>
  //     import(
  //       "@/views/assetManagement/ipManagement/mainSiteManagement/mainSiteAddressApplication/index.vue"
  //     ),
  // },
];
