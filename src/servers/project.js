// import { request } from '@uiw-admin/utils'
import request from '../utils/request'

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

// 任务列表新增
export const getmMnagerAssignmentSave = (params) => {
  return request('/api/ManagerAssignment/managerAssignmentSave', {
    method: 'POST',
    body: params,
  })
}

// 任务列表编辑
export const getManagerAssignmentUpdate = (params) => {
  return request('/api/ManagerAssignment/managerAssignmentUpdate', {
    method: 'POST',
    body: params,
  })
}

// 任务列表编辑
export const getManagerAssignmentSelectById = (params) => {
  return request('/api/ManagerAssignment/selectById', {
    method: 'POST',
    body: params,
  })
}

// 任务列表新增
export const managerAssignmentSave =
  '/api/ManagerAssignment/managerAssignmentSave'

// 编辑列表
export const managerAssignmentUpdate =
  '/api/ManagerAssignment/managerAssignmentUpdate'

// 删除任务列表
export const deleteAssignment = (params) => {
  return request('/api/ManagerAssignment/deletes', {
    method: 'POST',
    body: params,
  })
}
//新增评论
export const getAssignmentHistorySave = (params) => {
  return request('/api/ManagerAssignmentHistory/assignmentHistorySave', {
    method: 'POST',
    body: params,
  })
}
