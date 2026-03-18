import request from "@/utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";

// 获取月度任务量统计列表
export const getMonthPageList = (params) =>
  noLoadRequest.post("agile-biz/api/report-main/page/list", params);
//生成月度任务统计
export const addMonthPage = (params) =>
  request.post("agile-biz/api/report-main/generate", params);
//获取详情项目下拉列表/
export const getProjectList = (reportId) =>
  noLoadRequest.get(
    "agile-biz/api/report-detail/projects?reportId=" + reportId
  );
//获取详情负责人下拉列表/
export const getAssigneesList = (reportId) =>
  noLoadRequest.get(
    "agile-biz/api/report-detail/assignees?reportId=" + reportId
  );
//月度统计详情列表
export const getDetailList = (params) =>
  noLoadRequest.post("agile-biz/api/report-summary/list", params);
//月度统计详情人员明细列表pi/report-detail/list
export const getPersonDetailList = (params) =>
  noLoadRequest.post("agile-biz/api/report-detail/list", params);
//获取年度下拉列表/
export const getYearList = () =>
  noLoadRequest.get("agile-biz/api/report-main/year");
//获取月度下拉列表/
export const getMonthList = () =>
  noLoadRequest.get("agile-biz/api/report-main/month");
//下载月报
export const exportMonthFile = (params) =>
  exportFile("/agile-biz/api/report-main/export", params);
//人员任务统计查询列表、柱状图
export const personTaskReportList = (params) =>
  request.post("agile-biz/api/report-main/personTaskReport/list", params);
//人员任务统计查询详情列表
export const personTaskReportDetail = (params) =>
  request.post("agile-biz/api/report-main/personTaskReport/detail", params);
