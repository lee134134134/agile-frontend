/**
 * 存放基础路由、详情路由等
 */
export default [
  {
    path: "/iterationManagement/detail",
    name: "iterationManagementDetail",
    component: () => import("../views/IterationManagement/detailIndex.vue"),
    meta: {
      title: "迭代详情",
      inlayout: false,
    },
  },
  {
    path: "/iterationManagement/meeting",
    name: "iterationManagementMeeting",
    component: () => import("../views/IterationManagement/meetingManage.vue"),
    meta: {
      title: "迭代会议管理",
      inlayout: false,
    },
  },
  {
    path: "/docManagement/templateDoc",
    name: "templateDoc",
    component: () => import("../views/DocManagement/templateDocIndex.vue"),
    meta: {
      title: "模板文档配置",
      inlayout: false,
    },
  },
  {
    path: "/defectManagement/defectRpt",
    name: "defectRpt",
    component: () => import("../views/DefectManagement/defectRpt.vue"),
    meta: {
      title: "缺陷报告",
      inlayout: false,
    },
  },
  {
    path: "/personInfo",
    name: "personInfo",
    component: () => import("../views/common/PersonInfo.vue"),
    meta: {
      title: "个人信息",
      inlayout: false,
    },
  },
  {
    path: "/docManagement/deleList",
    name: "deleList",
    component: () => import("../views/DocManagement/deleListIndex.vue"),
    meta: {
      title: "已删除列表",
      inlayout: false,
    },
  },
  {
    path: "/iterationRetrospective/moodCurve",
    name: "iterationMoodCurve",
    component: () => import("../views/IterationRetrospective/moodCurve.vue"),
    meta: {
      title: "心情曲线",
      inlayout: false,
    },
  },
  {
    path: "/iterationRetrospective/iterationSummary",
    name: "iterationSummary",
    component: () =>
      import("../views/IterationRetrospective/iterationSummary.vue"),
    meta: {
      title: "迭代总结",
      inlayout: false,
    },
  },
  {
    path: "/iterationRetrospective/feedbackPage",
    name: "feedbackPage",
    component: () => import("../views/IterationRetrospective/feedbackPage.vue"),
    meta: {
      title: "意见反馈",
      inlayout: false,
    },
  },
  {
    path: "/agilePoker/estimateRoom",
    name: "estimateRoom",
    component: () => import("../views/AgilePoker/estimateRoom.vue"),
    meta: {
      title: "出牌房间",
      inlayout: false,
    },
  },
  {
    path: "/agilePoker/resultRoom",
    name: "resultRoom",
    component: () => import("../views/AgilePoker/resultRoom.vue"),
    meta: {
      title: "亮牌房间",
      inlayout: false,
    },
  },
  {
    path: "/project/projectTree",
    name: "projectTree",
    component: () => import("../views/ProjectManagement/ProjectTree.vue"),
    meta: {
      title: "项目树管理",
      inlayout: false,
    },
  },
  {
    path: "/project/timeLine",
    name: "timeLine",
    component: () => import("../views/ProjectManagement/projectTimeLine.vue"),
    meta: {
      title: "迭代时间轴",
      inlayout: false,
    },
  },
  {
    path: "/project/timeLine/detail",
    name: "timeLineDetail",
    component: () => import("../views/ProjectManagement/timeLineDetail.vue"),
    meta: {
      title: "迭代时间轴详情",
      inlayout: false,
    },
  },
  {
    path: "/agilePoker/pokerHistory",
    name: "pokerHistory",
    component: () => import("../views/AgilePoker/pokerHistory.vue"),
    meta: {
      title: "估算历史",
      inlayout: false,
    },
  },
  {
    path: "/uiManagement/uiDetail",
    name: "uiDetail",
    component: () => import("../views/UIManagement/UIDetail.vue"),
    meta: {
      title: "UI原型",
      inlayout: false,
    },
  },
  {
    path: "/growthSpace/subjectDetails",
    name: "subjectDetails",
    component: () => import("../views/GrowthSpace/subjectDetails.vue"),
    meta: {
      title: "主题详情",
      inlayout: false,
    },
  },

  // {
  //   path: "/assetManagement/ipManagement/lanIPManagement/lanIPApproval/:type/:process",
  //   name: "LanIPApproval",
  //   meta: { title: "局域网IP流程申请" }, // 基础
  //   component: () => import("@/views/assetManagement/ipManagement/lanIPManagement/lanIPApproval/index.vue"),
  //   beforeEnter: to => {
  //     if (to.params.type == "view") {
  //       to.meta.title = "局域网IP流程查看"
  //       to.matched[to.matched.length - 1].meta.title = "局域网IP流程查看"
  //     } else if (to.params.type == "deal") {
  //       to.meta.title = "局域网IP流程审批"
  //       to.matched[to.matched.length - 1].meta.title = "局域网IP流程审批"
  //     } else {
  //       to.meta.title = "局域网IP流程申请"
  //       to.matched[to.matched.length - 1].meta.title = "局域网IP流程申请"
  //     }
  //   }
  // },
];
