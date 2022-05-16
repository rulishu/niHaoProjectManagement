import { request } from '@uiw-admin/utils'

/**
 * 团队 API
 */
// 新增团队
export const addTeam = (params) => {
  return request('/api/managerTeam/addTeam', {
    method: 'POST',
    body: params,
  })
}

// 根据团队 ID 删除团队
export const deleteTeamById = (params) => {
  return request('/api/managerTeam/deleteTeamById', {
    method: 'POST',
    body: params,
  })
}

// 修改团队
export const editTeam = (params) => {
  return request('/api/managerTeam/editTeam', {
    method: 'POST',
    body: params,
  })
}
// 分页查找团队
export const getPageTeam = (params) => {
  return request('/api/managerTeam/queryByPage', {
    method: 'POST',
    body: params,
  })
}

// 通过团队id查询团队信息
export const getTeamInfoById = (params) => {
  return request('/api/managerTeam/queryTeamById', {
    method: 'POST',
    body: params,
  })
}

/**
 * 团队成员操作相关API
 */

// 新增团队成员
export const addTeamMember = (params) => {
  return request('/api/managerTeamMember/addTeamMember', {
    method: 'POST',
    body: params,
  })
}

// 根据id删除团队成员
export const deleteTeamMemberById = (params) => {
  return request('/api/managerTeamMember/deleteById', {
    method: 'POST',
    body: params,
  })
}

// 获取登录用户所参与的项目和任务
export const getCurrentUserAllItem = () => {
  return request('/api/managerTeamMember/getAllProjectAndAssigment', {
    method: 'GET',
  })
}

// 通过团队id查询团队成员信息
export const getMemberByTeamId = (params) => {
  return request('/api/managerTeamMember/queryMemberByTeamId', {
    method: 'POST',
    body: params,
  })
}

// 分页查询用户列表数据
export const getTeamMemberList = (params) => {
  return request('/api/managerTeamMember/queryByPage', {
    method: 'POST',
    body: params,
  })
}

// 修改团队成员信息
export const editTeamMemberInfo = (params) => {
  return request('/api/managerTeamMember/updateTeamMember', {
    method: 'POST',
    body: params,
  })
}
