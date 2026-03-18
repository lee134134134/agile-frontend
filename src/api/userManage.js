import request from "../utils/http.js";
// import exportFile from "@/utils/exportFile.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
/**
 * 用户管理菜单模块
 * 下拉列表：/user/page/list
 * 禁用/启用功能：/user/disable
 * 重置密码：/user/reset/password？userId={userId}
 * 修改密码：/user/admin/reset-password ？userId={userId}newPassword={newPassword}
 * 角色下拉列表 :agile-biz/api/user/role/list
 * 分配角色：Post  /agile-biz/api/user/add/roles 添加角色
 */
export const userList = (params) =>
  noLoadRequest.post("agile-biz/api/user/page/list", params);
export const userDisable = (params) => request.post("agile-biz/api/user/disable", params);
export const resetPassword = (params) =>
  request.post("agile-biz/api/user/reset/password?userId=" + params.userId);
//角色下拉列表
export const roleSelectList = () => noMegRequest.get("agile-biz/api/user/role/list");
export const addRole = (params) => request.post("agile-biz/api/user/add/roles", params);
//岗位新增
export const addPosition = (params) =>
  request.post("agile-biz/api/user/add/position", params);
