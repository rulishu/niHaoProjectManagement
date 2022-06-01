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
