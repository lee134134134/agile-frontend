import request from "@/utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import downFile from "@/utils/downDileHttp.js";

// 获取模板列表
export const getTemListFn = (params) =>
  request.post("agile-biz/api/document/templates/list", params);
//新增模板
export const temAddList = (params) =>
  request.post("agile-biz/api/document/templates/create", params);
//编辑模板
export const temEditFn = (params) =>
  request.post("agile-biz/api/document/templates/update", params);
// //文件编辑器获取文件
export const getFileInfo = (params) =>
  downFile.get(
    "agile-biz/api/document/templates/download?documentCode=" +
      params.documentCode
  );
//模板文件上移下移
export const movePermission = (params) =>
  request.post("agile-biz/api/document/templates/order", params);
//删除模板
export const temDeleFn = (params) =>
  request.post("agile-biz/api/document/templates/delete", params);
// 获取项目文档列表
export const getProListFn = (params) =>
  request.post("agile-biz/api/document/project/list", params);
// 新增项目文档
export const proDocAddFn = (params) =>
  request.post("agile-biz/api/document/project/create", params);
// 编辑项目文档基本信息
export const proDocEditFn = (params) =>
  request.post("agile-biz/api/document/project/update", params);
//获取模板下拉列表
export const temSelectFn = () =>
  request.post("agile-biz/api/document/project/selectInfo");
//删除项目文档
export const proDocDeleFn = (params) =>
  request.post("agile-biz/api/document/project/delete", params);
//导出文件单个文件http://localhost:3012/agile-biz/api/document/project/download
export const getFile = (params) =>
  downFile.post("agile-biz/api/document/project/download", params, {
    responseType: "blob",
  });
export const getFileZip = (params) =>
  downFile.post("agile-biz/api/document/project/downloads", params, {
    responseType: "blob",
  });
//下载pdf/agile-biz/api/document/templates/pdf/download
export const getPdfFile = (params) =>
  downFile.post("agile-biz/api/document/templates/pdf/download", params, {
    responseType: "blob",
  });
//知识库文档列表/
export const getKnowledgeListFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/list", params);
//知识库文档新建
export const addKnowledgeDocFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/create", params);
//知识库文档修改
export const editKnowledgeDocFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/update", params);
//知识库文档删除
export const deleKnowledgeDocFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/delete", params);
//知识库批量删除（彻底删除）
export const deleClearKnowledgeDocFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/delete/batch", params);
//知识库历史列表agile-biz/api/knowledge/documents/history/list
export const getHistoryDocFn = (params) =>
  request.get(
    "agile-biz/api/knowledge/documents/history/list?documentCode=" +
      params.documentCode
  );
//历史版本文件获取
export const getHistoryFileInfo = (id) =>
  downFile.get("agile-biz/api/document/templates/download/history?id=" + id);
//知识管理-知识库列表
export const getKnowledgeListViewFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/list/all", params);
//知识库删除-全部清空
export const deleClearAllKnowledgeDocFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/clear/all", params);
//知识库管理删除全部清空检查全部文件数
export const getClearAllKnowledgeDocNumFn = (params) =>
  request.post("agile-biz/api/knowledge/documents/delete/count", params);
//历史版本文件查看
export const getHistoryFileView = (id) =>
  downFile.get("agile-biz/api/document/templates/download/historyPdf?id=" + id);
//判断pdf是否生成/
export const checkPdfFile = (params) =>
  request.post("agile-biz/api/document/templates/check/hasPdf", params);
//历史版本查看//历史版本文件查看
export const getHistoryFileReView = (id) =>
  downFile.get(
    "agile-biz/api/document/templates/download/historyWord?id=" + id
  );
