import request from '@/utils/request'

/**
 * 查询所有看板
 */
export function selectAllBoard(params) {
  return request('/api/ManagerBoard/selectAllBoard', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 查询看板中所有列表
 */
export function selectAllBoardNote(params) {
  return request('/api/ManagerBNAController/selectAllBoardNote', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 新建看板
 */
export function saveBoard(params) {
  return request('/api/ManagerBoard/saveBoard', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 新增看板列表
 */
export function addBoardList(params) {
  return request('/api/ManagerBNAController/addBoardList', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 新建待转任务
 */
export function quickInsertTransfer(params) {
  return request('/api/ManagerBNAController/quickInsertTransfer', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 删除列表
 */
export function deleteBoardList(params) {
  return request('/api/ManagerBNAController/deleteBoardList', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 删除note
 */
export function deleteBoardNote(params) {
  return request('/api/ManagerBNAController/deleteBoardNote', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 删除看板
 */
export function deleteBoard(params) {
  return request('/api/ManagerBoard/deleteBoard', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * item拖动到列表
 */
export function dragAssignmentNote(params) {
  return request('/api/ManagerBNAController/dragAssignmentNote', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 查询任务详情
 */
export function selectByProjectId(params) {
  return request('/api/ManagerAssignment/selectByProjectId', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * note转成任务
 */
export function noteToAssignment(params) {
  return request('/api/ManagerBNAController/noteToAssignment', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 编辑note
 */
export function updateBoardNote(params) {
  return request('/api/ManagerBNAController/updateBoardNote', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 编辑list
 */
export function updateBoardList(params) {
  return request('/api/ManagerBNAController/updateBoardList', {
    method: 'POST',
    body: { ...params },
  })
}

// 模糊查询所有用户
export const pullSelectAll = (params) => {
  return request('/api/member/queryFuzzyAllProjectMember', {
    method: 'POST',
    body: params,
  })
}

// 所有里程碑查询
export function getSelectAll(params) {
  return request('/api/milestones/selectAll', {
    method: 'POST',
    body: { ...params },
  })
}

// 编辑任务状态
export function changeAssignmentStatus(params) {
  return request('/api/ManagerAssignment/changeAssignmentStatus', {
    method: 'POST',
    body: { ...params },
  })
}

// 编辑任务指派人
export function changeAssignmentUser(params) {
  return request('/api/ManagerAssignment/changeAssignmentUser', {
    method: 'POST',
    body: { ...params },
  })
}

// 编辑任务里程碑
export function changeAssignmentMilestones(params) {
  return request('/api/ManagerAssignment/changeAssignmentMilestones', {
    method: 'POST',
    body: { ...params },
  })
}

// 编辑任务截止日期
export function changeCloseTime(params) {
  return request('/api/ManagerAssignment/changeCloseTime', {
    method: 'POST',
    body: { ...params },
  })
}
