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
export function deleteBoardNote(params) {
  return request('/api/ManagerBNAController/deleteBoardList', {
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
