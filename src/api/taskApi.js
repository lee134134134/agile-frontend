import request from "@/utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";

// 获取迭代下拉列表
export const getSprintList = () => noMegRequest.get("agile-biz/api/sprint/onwerList");
//获取迭代下功能需求模块下拉列表
export const getSprintModuleList = (params) =>
  noMegRequest.post("agile-biz/api/sprint/moduleList", params);
//获取用户故事列表agile-biz/api/sprint/storyList
export const getSprintStoryList = (params) =>
  request.post("agile-biz/api/sprint/storyList", params);
//根据故事筛选获取任务列表
export const getStoryTaskList = (params) =>
  request.post("agile-biz/api/task/list", params);
//新增任务agile-biz/api/task/add
export const addTaskList = (params) => request.post("agile-biz/api/task/add", params);
//编辑任务 agile-biz/api/task/update
export const updateTaskList = (params) =>
  request.post("agile-biz/api/task/update", params);
//删除任务 agile-biz/api/task/delete
export const deleTaskList = (params) => request.post("agile-biz/api/task/delete", params);
