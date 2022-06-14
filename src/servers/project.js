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

// 查询任务列表数据(不分页)
export const getAssignment = (params) => {
  return request('/api/project/getAssignment', {
    method: 'POST',
    body: params,
  })
}

// 任务列表新增
export const getmMnagerAssignmentSave = (params) => {
  return request('/api/ManagerAssignment/managerAssignmentSave', {
    method: 'POST',
    body: { ...params },
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
  return request('/api/ManagerAssignment/selectByProjectId', {
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

//编辑评论
export const getAssignmentHistoryEdit = (params) => {
  return request('/api/ManagerAssignmentHistory/assignmentHistoryUpdate', {
    method: 'POST',
    body: params,
  })
}

//删除评论
export const getAssignmentHistoryDel = (params) => {
  return request('/api/ManagerAssignmentHistory/delete', {
    method: 'POST',
    body: params,
  })
}

// 查询成员不分页
export const queryFuzzyAllProjectMember = (params) => {
  return request('/api/member/queryFuzzyAllProjectMember', {
    method: 'POST',
    body: params,
  })
}

// 查询所有里程碑
export const selectLabel = (params) => {
  return request('/api/milestones/selectAll', {
    method: 'POST',
    body: params,
  })
}

// 查询所有标签
export const assignment_label = (params) => {
  return request('/api/system/dict/data/type/assignment_label', {
    method: 'POST',
    body: params,
  })
}

//获取任务列表各状态总数
export function countAssignment(params) {
  return request('/api/ManagerAssignment/countAssignment', {
    method: 'POST',
    body: params,
  })
}

//添加任务至我的待办
export function addMyToDo(params) {
  return request('/api/ManagerTodoList/addMyToDo', {
    method: 'POST',
    body: params,
  })
}
//待办事项转换批量
export const getStrutsSwitch = (params) => {
  return request('/api/ManagerTodoList/strutsSwitchBatch', {
    method: 'POST',
    body: params,
  })
}
