import { request } from '@uiw-admin/utils'

const token = localStorage.getItem('token')
// 上传文件
export const uploadFile = (params) => {
  return request('/api/file/uploadFile', {
    method: 'POST',
    body: params,
    headers: { Authorization: 'Bearer ' + token },
    requestType: 'form',
  })
}

// 根据uuid查询文件路径
export const selectFilePathById = (params) => {
  return request(`/api/project/selectFilePathById/${params.uuid}`, {
    method: 'POST',
    body: params,
    headers: { Authorization: 'Bearer ' + token },
    requestType: 'form',
  })
}

// 根据uuid查询文件路径
export const downloadFilePathById = (params) => {
  return request('/api/file/download', {
    method: 'POST',
    body: params,
    headers: { Authorization: 'Bearer ' + token },
    responseType: 'blob',
  })
}
