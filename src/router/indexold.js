import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";
// import { getUserInfo } from '@/api/api.js'
import Login from "../views/Login/index.vue";
import { ElLoading } from "element-plus";
// import Home from "../views/index.vue";
// import UserManagement from "../views/UserManagement/index.vue";
// import DictionaryManagement from "../views/DictionaryManagement/index.vue";
// import ProjectManagement from "../views/ProjectManagement/index.vue";
// import DemandManagement from "../views/DemandManagement/index.vue";
// import UIManagement from "../views/UIManagement/index.vue";
// import UserStory from "../views/UserStory/index.vue";
// import IterationManagement from "../views/IterationManagement/index.vue";
// import TaskManagement from "../views/TaskManagement/index.vue";
// import TestCase from "../views/TestCase/index.vue";
// import DefectManagement from "../views/DefectManagement/index.vue";
// import AgileBoard from "../views/AgileBoard/index.vue";
// import KnowledgeManagement from "../views/KnowledgeManagement/index.vue";
// import AgilePoker from "../views/AgilePoker/index.vue";
// import EstimateHistory from "../views/EstimateHistory/index.vue";
// import AgileKnowledge from "../views/AgileKnowledge/index.vue";
// import IterationSuggestionBox from "../views/IterationSuggestionBox/index.vue";
// import MoodCurve from "../views/MoodCurve/index.vue";
// import RoleManagement from "../views/RoleManagement/index.vue";
// import PermissionManagement from "../views/PermissionManagement/index.vue";
// import OperationLog from "../views/OperationLog/index.vue";
// import MyTodo from "../views/MyTodo/index.vue";
// import ProjectTree from "../views/ProjectManagement/ProjectTree.vue";
// const matchView = import.meta.glob("../views/**/**");
import { useUserStore } from "@/stores/user";
const WhiteList = ["/login", "/"];
const routers = [
  {
    path: "/login",
    name: "login",
    navShow: false,
    isInnerPage: false,
    isSystem: false,
    isTool: false,
    meta: {
      token: false,
      showRouter: false,
      keepAlive: false,
      title: "敏捷开发平台",
    },
    component: Login,
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers,
});

//  const router = createRouter({
//    history: createWebHistory(import.meta.env.BASE_URL),
//    routes: [
//      {
//        id:'1',
//        path: "/home",
//        name: "home",
//        navShow: true,
//        isInnerPage: false,
//        isSystem:false,
//        isTool:false,
//        meta: {
//          token: false,
//          showRouter: false,
//          keepAlive: false,
//          title: "首页",
//        },
//        component: Home,
//      },{
//        id:'2',
//        path: "/project",
//        name: "project",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:true,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "项目管理",
//       },
//       component: ProjectManagement,
//     },{
//       id:'3',
//       path: "/demand",
//       name: "demand",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "需求管理",
//       },
//       component: DemandManagement,
//     },{
//       id:'4',
//       path: "/uiManagement",
//       name: "uiManagement",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "UI管理",
//       },
//       component: UIManagement,
//     },{
//       id:'5',
//       path: "/userStory",
//       name: "userStory",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "用户故事",
//       },
//       component: UserStory,
//     },{
//       id:'6',
//       path: "/iterationManagement",
//       name: "iterationManagement",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "迭代管理",
//       },
//       component: IterationManagement,
//     },{
//       id:'7',
//       path: "/taskManagement",
//       name: "taskManagement",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "任务管理",
//       },
//       component: TaskManagement,
//     },{
//       id:'8',
//       path: "/testCase",
//       name: "testCase",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "测试用例",
//       },
//       component: TestCase,
//     },{
//       id:'9',
//       path: "/defectManagement",
//       name: "defectManagement",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "缺陷管理",
//       },
//       component: DefectManagement,
//     },{
//       id:'10',
//       path: "/agileBoard",
//       name: "agileBoard",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "敏捷看板",
//       },
//       component: AgileBoard,
//     },{
//       id:'11',
//       path: "/knowledgeManagement",
//       name: "knowledgeManagement",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "知识管理",
//       },
//       component: KnowledgeManagement,
//     },{
//       id:'12',
//       path: "/myTodo",
//       name: "myTodo",
//       navShow: true,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "我的待办",
//       },
//       component: MyTodo,
//     },{
//        id:'13',
//       path: "/dictionaryManagement",
//       name: "dictionaryManagement",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:true,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "字典管理",
//       },
//       component: DictionaryManagement,
//     },{
//        id:'14',
//       path: "/userManagement",
//       name: "userManagement",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:true,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "用户管理",
//       },
//       component: UserManagement,
//     },{
//       id:'15',
//       path: "/roleManagement",
//       name: "roleManagement",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:true,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "角色管理",
//       },
//       component: RoleManagement,
//     },{
//       id:'16',
//       path: "/permissionManagement",
//       name: "permissionManagement",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:true,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "权限管理",
//       },
//       component: PermissionManagement,
//     },{
//        id:'17',
//       path: "/operationLog",
//       name: "operationLog",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:true,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "操作日志",
//       },
//       component: OperationLog,
//     },{
//        id:'18',
//       path: "/agilePoker",
//       name: "agilePoker",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:true,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "敏捷扑克",
//       },
//       component: AgilePoker,
//     },{
//        id:'19',
//       path: "/estimateHistory",
//       name: "estimateHistory",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:true,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "估算历史",
//       },
//       component: EstimateHistory,
//     },{
//        id:'20',
//       path: "/agileKnowledge",
//       name: "agileKnowledge",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:true,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "敏捷开发知识",
//       },
//       component: AgileKnowledge,
//     },{
//        id:'21',
//       path: "/iterationSuggestionBox",
//       name: "iterationSuggestionBox",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:true,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "迭代意见箱",
//       },
//       component: IterationSuggestionBox,
//     },{
//        id:'22',
//       path: "/moodCurve",
//       name: "moodCurve",
//       iconStyle: "",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:true,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "心情曲线",
//       },
//       component: MoodCurve,
//     },
//     {
//        id:'23',
//       path: "/login",
//       name: "login",
//       navShow: false,
//       isInnerPage: false,
//       isSystem:false,
//       isTool:false,
//       meta: {
//         token: false,
//         showRouter: false,
//         keepAlive: false,
//         title: "敏捷开发-首页",
//       },
//       component: Login,
//     },{
//        id:'24',
//         path: "/projectTree",
//         name: "projectTree",
//         navShow: false,
//         isInnerPage: true,
//         isSystem:false,
//         isTool:false,
//         meta: {
//           token: false,
//           showRouter: false,
//           keepAlive: false,
//           title: "项目树管理",
//         },
//         component: ProjectTree,
//     },
//   ],
// });

router.beforeEach((to, from, next) => {
  let token = Cookies.get("agiles_token") || "";
  let hasToken = token ? true : false;
  const store = useUserStore();

  if (to.path == "/login" && token) {
    next("/home");
  }
  if (to.path == "/" && token) {
    next("/home");
  }
  if (WhiteList.indexOf(to.path) == -1) {
   / // let menus = JSON.parse(localStorage.getItem("agiles_router")) ?? [];

    if (store.routers.length == 0 && token) {
      let loading = ElLoading.service({
        lock: true,
        text: "Loading",
        fullscreen: true,
        background: "#f5F7FA",
      });
      store
        .getUserInfoFn()
        .then(() => {
          store.routers.forEach((item) => {
            let model = import.meta.glob("../views/**/*.vue");
            router.addRoute({
              path: item.path,
              parentId: 0,
              name: item.name,
              navShow: item.navShow == 1 ? true : false,
              isInnerPage: item.isInnerPage == 1 ? true : false,
              isSystem: item.isSystem == 1 ? true : false,
              isTool: item.isTool == 1 ? true : false,
              meta: item.metaVO,
              component: model[`../views/${item.component}`],
            });
          });
          console.log(router.getRoutes());
          loading.close();
          return next({ ...to, replace: true });
        })
        .catch((err) => {
          console.log("路由守卫报错了，检查权限数据获取问题", err);
          loading.close();
          return;
        });
    } else {
      // if (menus.length != 0 && token) {
      //   menus.forEach((item) => {
      //     let model = import.meta.glob("../views/**/*.vue");
      //     router.addRoute({
      //       path: item.path,
      //       parentId: 0,
      //       name: item.name,
      //       navShow: item.navShow == 1 ? true : false,
      //       isInnerPage: item.isInnerPage == 1 ? true : false,
      //       isSystem: item.isSystem == 1 ? true : false,
      //       isTool: item.isTool == 1 ? true : false,
      //       meta: item.metaVO,
      //       component: model[`../views/${item.component}`],
      //     });
      //   });
      //   console.log(router.getRoutes());
      //   return next({ ...to, replace: true });
      // }
      if (!hasToken) {
        next({ path: "/login" });
      }
      next();
    }
  } else {
    next();
  }
});
export default router;
