import request from '../utils/http.js'
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";

// 查询迭代列表
export const handleReviewIteraList = (params) =>  noMegRequest.get(`agile-biz/api/review/sprint/v1/list?projectCode=${params.projectCode}&sprintName=${params.sprintName}`)

// 查询心情曲线录入周期
export const getCycle = (params) =>  noMegRequest.get(`agile-biz/api/review/mood/v1/sprint_dates/${params}`)

// 查询个人心情曲线数据
export const getMoodData = (params) =>  noMegRequest.get(`agile-biz/api/review/mood/v1/list/${params}`)

// 保存心情曲线
export const saveMood = (params) =>  noMegRequest.post('agile-biz/api/review/mood/v1/save_modify', params)

// 查询团队统计数据
export const getTeamStaticsData = (params) =>  noMegRequest.get(`agile-biz/api/review/mood/v1/statistics/${params}`)

// 查询团队心情曲线数据
export const getTeamMoodData = (params) =>  noMegRequest.get(`agile-biz/api/review/mood/v1/picture?sprintId=${params.sprintId}&type=${params.type}`)



// 迭代总结新增
export const handleAddSummary = (params) =>  request.post('agile-biz/api/review/sprint/v1/save_modify', params)

// 获取迭代总结列表
export const getSummaryList = (params) => noMegRequest.get(`agile-biz/api/review/sprint/summary/v1/list/${params}`)

// 保存迭代总结评论
export const saveComment = (params) =>  request.post('agile-biz/api/sprint/comment/save_modify', params)



// 查询意见列表
export const getVoteList = (params) => $http.get(`agile-biz/api/review/op-fb/v1/list?solutionStatus=${params.solutionStatus}&opinionType=${params.opinionType}&sprintId=${params.sprintId}`)

// 查询意见详情
export const getVoteInfo = (params) => noMegRequest.get(`agile-biz/api/review/op-fb/v1/info/${params}`)

// 提交、编辑意见
export const handleAddVote = (params) =>  request.post('agile-biz/api/review/op-fb/v1/save_modify', params)

// 查询解决方案
export const getSolutionInfo = (params) => noMegRequest.get(`agile-biz/api/review/op-fb/solution/v1/info/${params}`)

// 添加、编辑解决方案
export const AddSolutionInfo = (params) => noMegRequest.post('agile-biz/api/review/op-fb/solution/v1/save_modify', params)

// 投票、取消投票
export const handleVote = (params) => noMegRequest.post('agile-biz/api/review/op-fb/vote/v1/save_del', params)

// 获取投票结果
export const getVoteResult = (params) => noMegRequest.get(`agile-biz/api/review/op-fb/v1/votes/${params}`)

