import request from '../utils/commentHttp.js'


export const uploadFileBatch = (params) => request.put('investment-biz/invest/temp/v1/import_local', params)
export const downLoadFile = (params) => request.get('pub-module-biz/pub-module/file-manage/v1/download/file?fileName=' + params.fileName + '&originName=' + params.originName)
