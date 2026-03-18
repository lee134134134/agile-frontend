import request from '../utils/http.js'
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";
import downDileHttp from "@/utils/downDileHttp.js";

// 查询缺陷列表
export const getDefectList = (params) => noMegRequest.post('agile-biz/api/defect/list', params)

// 查询缺陷详情
export const getDefectInfo = (params) => noMegRequest.post('agile-biz/api/defect/info', params)

// 添加缺陷
export const addDefect = (params) =>  request.post('agile-biz/api/defect/add', params)

// 上传附件
export const uploadAttach = (params) =>  noMegRequest.post('agile-biz/api/comment/upload', params)

// 编辑缺陷
export const editDefect = (params) =>  request.post('agile-biz/api/defect/update', params)

// 删除缺陷
export const deleteDefect = (params) =>  request.post('agile-biz/api/defect/delete', params)

// 下载附件
export const downloadAttach = (params) =>  downDileHttp.post('agile-biz/api/comment/download', params, {
    responseType: "blob"
})

// 下载单个附件
export const downloadSingleAttach = (params) =>  downDileHttp.post('agile-biz/api/comment/file/download', params, {
    responseType: "blob"
})

// 导出缺陷
export const exportDefect = (params) =>  exportFile('/agile-biz/api/defect/export', params)

// 查询缺陷报告
export const getDefectRptInfo = (params) => noMegRequest.post('agile-biz/api/defect/report', params)

// 生成缺陷报告
export const geneDefectRpt = (params) =>  downDileHttp.post('agile-biz/api/defect/report/export', params, {
    responseType: "blob"
})

// 上线报告：查询报告范围、状态
export const getLaunchRangeStatus = (params) => noMegRequest.post('agile-biz/api/defect/online/info', params)

// 生成上线报告
export const geneLaunchRpt = (params) => noMegRequest.post('agile-biz/api/defect/online/report', params)

// 修改预约状态
export const updateLaunchRptStatus = (params) => noMegRequest.post('agile-biz/api/defect/online/update', params)

// 下载上线报告
export const downloadLaunchRpt = (params) => downDileHttp.post('agile-biz/api/comment/online/download', params, {
    responseType: "blob"
})

// 关联缺陷
export const relateDefect = (params) => request.post('agile-biz/api/defect/relate', params)

// 取消关联
export const cancelRelate = (params) => request.post('agile-biz/api/defect/relate/cancel', params)

