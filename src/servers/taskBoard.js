import request from '@/utils/request'

/**
 * 查询所有看板
 */
export function selectAllTabulation(params) {
  return request('/api/ManagerBulletinBoard/selectAllBoard', {
    method: 'POST',
    body: { ...params },
  })
}
