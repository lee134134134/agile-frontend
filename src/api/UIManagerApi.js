import request from "../utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import downFile from "@/utils/downDileHttp.js";
//ui树/
export const getTreeList = (params) =>
  request.post("agile-biz/api/ui-manage/tree", params);
// 查询ui列表信息（点击树节点获取详情）
export const getTreeInfoList = (params) =>
  request.post("agile-biz/api/ui-manage/list", params);
//图片上传
export const uploadUIImage = (params) =>
  request.post("agile-biz/api/ui-manage/upload", params);
//添加ui设计图
export const addUI = (params) => request.post("agile-biz/api/ui-manage/add", params);
//编辑UI设计图/
export const editUI = (params) => request.post("agile-biz/api/ui-manage/update", params);

export const getImage = (params) =>
  downFile.post("agile-biz/api/ui-manage/preview", params, {
    responseType: "blob",
  });
//删除接口
export const deleUI = (params) => request.post("agile-biz/api/ui-manage/delete", params);
//下载
export const downLoadImage = (params) =>
  downFile.post("agile-biz/api/ui-manage/download", params, {
    responseType: "blob",
  });
