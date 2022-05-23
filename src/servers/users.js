import request from '@/utils/request'

/**
 * 根据项目查询成员列表
 * @page
 * @pageSize
 *
 */
export const selectUserByProjectId = (params) => {
  return request('/api/managerUCP/selectUserByProjectId', {
    method: 'POST',
    body: params,
  })
}

// 添加项目成员列表
export const addSaveUser = (params) => {
  return request('/api/managerUCP/save', {
    method: 'POST',
    body: params,
  })
}

// 根据id删除项目用户
export const deleteById = (params) => {
  return request('/api/managerUCP/delete', {
    method: 'POST',
    body: params,
  })
}

// 模糊查询所有用户
export const pullSelectAll = (params) => {
  // return request('/api/managerUser/pullSelectAll', {
  return request('/api/member/queryFuzzyAllProjectMember', {
    method: 'POST',
    body: params,
  })
}

// 上传文件
export const uploadFile = (params) => {
  return request('/api/project/insert', {
    method: 'POST',
    body: params,
    // requestType: 'form',
  })
}
