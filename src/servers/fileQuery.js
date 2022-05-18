import request from '@/utils/request'

// 上传文件
export const uploadFile = (params) => {
  return request('/api/file/uploadFile', {
    method: 'POST',
    body: params,
    requestType: 'form',
  })
}

// 根据uuid查询文件路径
export const selectFilePathById = (params) => {
  // return request(`/api/project/selectFilePathById/${params.uuid}`, {
  return request(`/api/file/selectFile/${params.uuid}`, {
    method: 'POST',
    body: params,
    requestType: 'form',
  })
}

// 根据uuid查询文件路径
export const downloadFilePathById = (params) => {
  return request('/api/file/download', {
    method: 'POST',
    body: params,
    responseType: 'blob',
  })
}
