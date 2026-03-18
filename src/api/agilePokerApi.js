import request from "../utils/http.js";
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";

// 获取列表信息
export const getGameRoundList = (params) =>
  request.post("agile-biz/api/gameRound/list", params);
// 获取项目下拉信息
export const getPorjectList = (params) =>
  noLoadRequest.get("agile-biz/api/gameRound/projects", params);
// 获取迭代下拉信息
export const getSprintList = (params) =>
  noLoadRequest.post("agile-biz/api/gameRound/sprint?code=" + params.code);
// 获取需求下拉信息
export const getRequirementList = (params) =>
  noLoadRequest.post("agile-biz/api/gameRound/requirement?code=" + params.code);
// 估算历史获取需求下拉信息
export const getHistoryRequirementList = (params) =>
  noLoadRequest.post("agile-biz/api/gameRound/requirementForHistory?code=" + params.code);
// 获取用户故事下拉信息
export const getStoryList = (params) =>
  noLoadRequest.post("agile-biz/api/gameRound/story", params);
//估算历史列表
export const getGameRoundHistoryList = (params) =>
  request.post("agile-biz/api/gameRound/log/list", params);
//出牌房间：获取当前故事出牌信息agile-biz/api/gameRound/getPepCard
export const getPepCard = (params) =>
  request.post("agile-biz/api/gameRound/getPepCard?code=" + params.code);
//出牌
export const gameRoundVote = (params) =>
  request.post("agile-biz/api/gameRound/vote", params);
//亮牌房间 亮牌信息获取
export const gameRoundReveal = (params) =>
  request.post("agile-biz/api/gameRound/reveal", params);
//开始下一轮agile-biz/api/gameRound/startNextRound
export const startNextRound = (params) =>
  request.post("agile-biz/api/gameRound/startNextRound", params);
//保存故事点 agile-biz/api/gameRound/savePoint
export const savePoint = (params) =>
  request.post("agile-biz/api/gameRound/savePoint", params);
