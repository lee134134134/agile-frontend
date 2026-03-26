import request from "../utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
//角色列表查询
export const roleList = (params) =>
  noMegRequest.post("agile-biz/role/manage/page/list", params);
//角色新增
export const roleAdd = (params) =>
  request.post("agile-biz/role/manage/add", params);
//角色编辑
export const roleEdit = (params) =>
  request.post("agile-biz/role/manage/edit", params);
//角色是否可以删除
export const roleCheckDele = (id) =>
  noMegRequest.post("agile-biz/role/manage/checkDelete/" + id);
//角色删除
export const roleDele = (id) =>
  request.post("agile-biz/role/manage/delete/" + id);
//权限配置列表
export const promissionList = () =>
  noMegRequest.post("agile-biz/api/systemFeature/list");
//角色配置保存
export const configFn = (params) =>
  request.post("agile-biz/role/manage/edit/auth", params);
//角色-配置权限树形结构列表
export const promissionTreeList = () =>
  noMegRequest.post("agile-biz/role/manage/tree/feature");
//菜单列表
export const menuList = () =>
    noMegRequest.post("agile-biz/api/systemFeature/menu");