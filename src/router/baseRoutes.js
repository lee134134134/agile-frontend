export function detailRoute(val) {
  const detailRouterList = [
    {
      path: "/iterationManagement/detail",
      parentPath: "/iterationManagement",
      name: "iterationManagementDetail",
    },
    {
      path: "/iterationManagement/meeting",
      parentPath: "/iterationManagement/detail",
      name: "iterationManagementMeeting",
    },
    {
      path: "/docManagement/templateDoc",
      parentPath: "/docManagement",
      name: "templateDoc",
    },
    {
      path: "/defectManagement/defectRpt",
      parentPath: "/defectManagement",
      name: "defectRpt",
    },
    {
      path: "/docManagement/deleList",
      parentPath: "/docManagement",
      name: "deleList",
    },
    {
      path: "/iterationRetrospective/moodCurve",
      parentPath: "/iterationRetrospective",
      name: "iterationMoodCurve",
    },
    {
      path: "/iterationRetrospective/iterationSummary",
      parentPath: "/iterationRetrospective",
      name: "iterationSummary",
    },
    {
      path: "/iterationRetrospective/feedbackPage",
      parentPath: "/iterationRetrospective",
      name: "feedbackPage",
    },
    {
      path: "/agilePoker/estimateRoom",
      parentPath: "/agilePoker",
      name: "estimateRoom",
    },
    {
      path: "/agilePoker/resultRoom",
      parentPath: "/agilePoker",
      name: "resultRoom",
    },
    {
      path: "/project/projectTree",
      parentPath: "/project",
      name: "projectTree",
    },
    {
      path: "/project/timeLine",
      parentPath: "/project",
      name: "timeLine",
    },
    {
      path: "/project/timeLine/detail",
      parentPath: "/project",
      name: "timeLineDetail",
    },
    {
      path: "/agilePoker/pokerHistory",
      parentPath: "/agilePoker",
      name: "pokerHistory",
    },
    {
      path: "/uiManagement/uiDetail",
      parentPath: "/uiManagement",
      name: "uiDetail",
    },
    {
      path: "/growthSpace/subjectDetails",
      parentPath: "/growthSpace",
      name: "subjectDetails",
    },
  ];
  return detailRouterList;
}
