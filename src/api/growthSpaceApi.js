import request from "../utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";
import downDileHttp from "@/utils/downDileHttp.js";

// 新增主题会议
export const growthSpaceCreate = (params) =>
  request.post("agile-biz/api/growthspace/theme/create", params);
//编辑主题会议
export const growthSpaceUpdata = (params) =>
  request.post("agile-biz/api/growthspace/theme/update", params);
//查询主题会议列表/
export const growthSpaceList = (params) =>
  request.post("agile-biz/api/growthspace/theme/list", params);
//查询主题会议详细信息
export const growthSpaceDetail = (params) =>
  request.post("agile-biz/api/growthspace/theme/info", params);
//删除主题会议详细信息
export const growthSpaceDele = (params) =>
  request.post("agile-biz/api/growthspace/theme/delete", params);

// 查询登记信息列表
export const getInfoList = (params) =>
  request.post("agile-biz/api/growthspace/registration/list", params);

// 新增登记信息列表
export const saveInfo = (params) =>
  request.post("agile-biz/api/growthspace/registration/submit", params);

// 删除登记信息
export const deleteInfo = (params) =>
  request.post("agile-biz/api/growthspace/registration/delete", params);

// 登记信息点赞
export const saveLikeInfo = (params) =>
  request.post("agile-biz/api/growthspace/like/add", params);
  
// 上传附件
export const uploadAttach = (params) =>
  request.post("agile-biz/api/comment/growthSpace/Upload", params);
  
  // 下载
export const downloadAttach = (params) =>
downDileHttp.post("agile-biz/api/comment/growthSpace/download", params, {
    responseType: "blob",
  });

// 获取词云
export const getWordCloud = (params) =>
  request.post("agile-biz/api/growthspace/wordcloud/get", params);