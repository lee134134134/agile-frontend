import request from "@/utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";

// 获取项目列表
export const getProjectList = (params) => request.get(`agile-biz/api/project/list?projectName=${params.projectName}&state=${params.state}`);
//新增项目
export const addProject = (params) =>
  request.post("agile-biz/api/project/addProject", params);
//项目详情agile-biz/api/project/{id}
export const getProjectInfo = (id) => noMegRequest.get(`agile-biz/api/project/${id}`);
//项目编辑保存/agile-biz/api/project/updateProject
export const emitProject = (params) =>
  request.post("agile-biz/api/project/updateProject", params);
//项目树信息获取/agile-biz/api/project/tree/list
export const getProjectTree = (params) =>
  request.post("agile-biz/api/project/tree/list", params);

//新增菜单、页面agile-biz/api/project/addNode
export const addTreeNode = (params) =>
  request.post("agile-biz/api/project/addNode", params);
//编辑节点信息/agile-biz/api/project/updateNode
export const updataTreeNode = (params) =>
  request.post("agile-biz/api/project/updateNode", params);
//项目树上移下移agile-biz/api/project/move
export const moveTreeNode = (params) =>
  request.post("agile-biz/api/project/move", params);
//项目节点删除接口/agile-biz/api/project/deleteNode
export const deleTreeNode = (params) =>
  request.post("agile-biz/api/project/deleteNode", params);
//项目节点能否删除检查接口/agile-biz/api/project/deleteNode/check
export const checkDeleTreeNode = (params) =>
  noMegRequest.post("agile-biz/api/project/deleteNode/check", params);
//项目概览查询agile-biz/api/project/timeLine/summary
export const projectSummary = (params) =>
  request.post("agile-biz/api/project/timeLine/summary", params);
//迭代时间轴详情/agile-biz/api/project/timeLine/info
export const getTimeLineInfo = (params) =>
  request.post("agile-biz/api/project/timeLine/info", params);
