import request from "../utils/http.js";
import loginRequest from "@/utils/loginHttps.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
// 权限-列表查询
export const getPermissionList = (params) =>
  request.post("agile-biz/api/systemFeature/list", params);
// 权限-保存
export const savePermission = (params) =>
  request.post("agile-biz/api/systemFeature/update", params);
// 权限-上下移动 // 1 上移， 2 下移
export const movePermission = (params) =>
  request.post("agile-biz/api/systemFeature/move", params);

//新增-新增至下拉列表
export const getTreeSelectList = (params) =>
  noMegRequest.post("agile-biz/api/systemFeature/selectInfo", params);

//新增-新增菜单目录
export const addSystemNodes = (params) =>
  request.post("agile-biz/api/systemFeature/create", params);

//权限菜单-列表
export const getPermissionMenuList = (params) =>
  request.post("agile-biz/api/systemFeature/listNew?needButton=" + params);

//菜单目录移动至其他层级
export const moveToOtherDir = (params) =>
  request.post("agile-biz/api/systemFeature/moveToOtherDir", params);

//菜单目录删除
export const deleteSystemFeature = (params) =>
  request.post("agile-biz/api/systemFeature/delete?id=" + params.id);

//新增按钮
export const addSystemBtns = (params) =>
  request.post("agile-biz/api/button/create", params);

//修改按钮
export const editSystemBtns = (params) =>
  request.post("agile-biz/api/button/update", params);

//删除按钮
export const deleteSystemBtn = (params) =>
  request.post("agile-biz/api/button/delete?id=" + params.id);
