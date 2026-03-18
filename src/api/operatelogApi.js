import request from "../utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";

// 查询操作日志文件列表
export const getOperationLogList = (params) =>
  noLoadRequest.post("agile-biz/api/operationLog/list", params);
//资源类型下拉列表
export const getSourceTypeList = (params) =>
  noLoadRequest.post("agile-biz/api/operationLog/sourceType", params);
//操作类型下拉列表
export const getOperationTypeList = (params) =>
  noLoadRequest.post("agile-biz/api/operationLog/operationType", params);
//系统功能路由
export const getSysRouterList = (params) =>
  noLoadRequest.post("agile-biz/api/operationLog/routeName", params);
