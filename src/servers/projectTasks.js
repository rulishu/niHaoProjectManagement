import request from '@/utils/request'

/**
 * 任务
 * @page
 * @pageSize
 */

// 更改任务里程碑
export const editTaskMilestone = (params) => {
  return request('/api/ManagerAssignment/changeAssignmentMilestones', {
    method: 'POST',
    body: params,
  })
}

// 转换为任务
export const convertToTask = (params) => {
  return request('/api/ManagerAssignment/changeAssignmentStatus', {
    method: 'POST',
    body: params,
  })
}

// 更改任务指派人
export const editTaskAssign = (params) => {
  return request('/api/ManagerAssignment/changeAssignmentUser', {
    method: 'POST',
    body: params,
  })
}

// 更改任务关闭时间
export const editTaskCloseTime = (params) => {
  return request('/api/ManagerAssignment/changeCloseTime', {
    method: 'POST',
    body: params,
  })
}

// 更改任务标签
export const editTaskLabel = (params) => {
  return request('/api/ManagerAssignment/changeLable', {
    method: 'POST',
    body: params,
  })
}

// 任务状态统计
export const countAssignment = (params) => {
  return request('/api/ManagerAssignment/countAssignment', {
    method: 'POST',
    body: params,
  })
}

// 批量删除
export const delBatchTake = (params) => {
  return request('/api/ManagerAssignment/deletes', {
    method: 'POST',
    body: params,
  })
}

// 任务列表新增
export const addTaskList = (params) => {
  return request('/api/ManagerAssignment/managerAssignmentSave', {
    method: 'POST',
    body: params,
  })
}

// 任务列表编辑
export const editTaskList = (params) => {
  return request('/api/ManagerAssignment/managerAssignmentUpdate', {
    method: 'POST',
    body: params,
  })
}

// 项目概览：任务列表
export const getProjectOverviewTask = (params) => {
  return request('/api/ManagerAssignment/projectOverview', {
    method: 'POST',
    body: params,
  })
}

// 任务列表详情查询
export const getTaskDetailsData = (params) => {
  return request('/api/ManagerAssignment/selectById', {
    method: 'POST',
    body: params,
  })
}

// 任务列表详情查询(不需校验)
export const getTaskDetailsDataUnCheck = (params) => {
  return request('/api/ManagerAssignment/selectByProjectId', {
    method: 'POST',
    body: params,
  })
}

// 任务列表分页查询
export const getTaskPagingData = (params) => {
  return request('/api/ManagerAssignment/selectPage', {
    method: 'POST',
    body: params,
  })
}
