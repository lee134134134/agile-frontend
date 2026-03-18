import request from "@/utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";

// 获取需求列表
export const getDemandList = (params) =>
  request.post("agile-biz/api/requirement/list", params);
//获取故事列表
export const getStoryList = (params) => request.post("agile-biz/api/story/list", params);
//新增用户故事列表
export const addStoryFn = (params) => request.post("agile-biz/api/story/create", params);
//编辑用户故事接口
export const updateStoryFn = (params) =>
  request.post("agile-biz/api/story/update", params);
//删除用户故事业务判断
export const deleStoryCheckFn = (params) =>
  noMegRequest.post("agile-biz/api/story/delete/check", params);
//删除用户故事
export const deleStoryFn = (params) => request.post("agile-biz/api/story/delete", params);
