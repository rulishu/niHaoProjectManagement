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
 * 新增看板列表
 */
export function addNote(params) {
  return request('/api/ManagerBNAController/addNote', {
    method: 'POST',
    body: { ...params },
  })
}

/**​
 * 删除列表
 */
export function deleteBoardNote(params) {
  return request('/api/ManagerBNAController/deleteBoardNote', {
    method: 'POST',
    body: { ...params },
  })
}
