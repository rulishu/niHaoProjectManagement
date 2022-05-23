import { request } from '@uiw-admin/utils'

/**
 * 查询任务列表数据
 * @page
 * @pageSize
 *
 */
export const getSelectPage = (params) => {
  return request('/api/ManagerAssignment/selectPage', {
    method: 'POST',
    body: params,
  })
}
//不分页 - 条件查询查询团队列表数据
export const getall = (params) => {
  return request('/api/ManagerTeam/all', {
    method: 'POST',
    body: params,
  })
}

//根据主键删除团队，支持批量
export const getdelete = (params) => {
  return request('/api/ManagerTeam/delete', {
    method: 'POST',
    body: params,
  })
}
// 获取团队下成员信息--可根据部门筛选
export const getMembers = (params) => {
  return request('/api/ManagerTeam/getMembers', {
    method: 'POST',
    body: params,
  })
}
//获取未加入团队用户列表--可根据部门筛选
export const getNotTeamUsers = (params) => {
  return request('/api/ManagerTeam/getNotTeamUsers', {
    method: 'POST',
    body: params,
  })
}
//新增团队
export const getinset = (params) => {
  return request('/api/ManagerTeam/inset', {
    method: 'POST',
    body: params,
  })
}
//更新团队
export const getupdate = (params) => {
  return request('/api/ManagerTeam/update', {
    method: 'POST',
    body: params,
  })
}
