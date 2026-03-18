import request from "../utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";
import {exportGetFile} from "@/utils/exportFile.js";
// 全量用户列表
export const getAllUserList = () =>
  noMegRequest.get("agile-biz/api/requirement/users");
// 角色用户列表
export const getRoleUserList = (name) =>
    noMegRequest.get(`agile-biz/api/requirement/stage/user/byRole?role=${name}`);

// 全量项目列表
export const getAllProjectList = () =>
  noMegRequest.get("agile-biz/api/requirement/projects ");
// 获取功能模块
export const getModelList = (params) =>
  noMegRequest.post("agile-biz/api/project/module/list", params);
//获取自定义列表表头接口 reportOrder/v1/get?username=admin&module=requirement
export const reportOrderList = (params) =>
  noMegRequest.get(
    `agile-biz/reportOrder/v1/get?username=${params.usrname}&module=${params.module} `
  );

//自定义表头保存
export const reportOrderSave = (params) =>
  request.post("agile-biz/reportOrder/v1/save", params);

//需求列表查询/agile-biz/api/requirement/page/list
export const demandList = (params) =>
  noLoadRequest.post("agile-biz/api/requirement/page/list", params);

//新增需求 /agile-biz/api/requirement/create
export const demandAddList = (params) =>
  request.post("agile-biz/api/requirement/create", params);

//更新需求agile-biz/api/requirement/update
export const demandUpdateList = (params) =>
  request.post("agile-biz/api/requirement/update", params);

//检验需求是否可以删除/agile-biz/api/requirement/{id}/check-delete
export const demandCheck = (id) =>
  noMegRequest.get(`agile-biz/api/requirement/${id}/check-delete`);

//删除需求agile-biz/api/requirement/delete
export const demandDele = (id) =>
  request.post("agile-biz/api/requirement/delete?id=" + id);

//导入需求/agile-biz/api/requirement/import
export const demandImport = (params) =>
  noMegRequest.post("agile-biz/api/requirement/import", params);
//导出需求模板
export function exportDemandListTemp(name) {
  return exportGetFile("/agile-biz/api/requirement/import/templateNew",{name});
}
//导出需求列表
export function exportDemandList(params) {
  return exportFile("/agile-biz/api/requirement/export", params);
}

//需求进度列表
export const demandProgressList = (params) =>
  noLoadRequest.post("agile-biz/api/requirement/stage/page/list", params);

//更新项目进度
export const demandUpdateProgressList = (params) =>
  request.post("agile-biz/api/requirement/stage/update", params);

//导出进度列表
export function exportDemandProgressList(params) {
  return exportFile("/agile-biz/api/requirement/progress/export", params);
}

//查询需求进度-评审跟踪流水
export const stageLog = (id) =>
    noMegRequest.get(`agile-biz/api/requirement/stage/update/log/${id}`);

//查询需求进度-评审跟踪流水
export const stageStatusLog = (id) =>
    noMegRequest.get(`agile-biz/api/requirement/stage/status/log/${id}`);