import { request } from '@uiw-admin/utils'

/**
 * 角色列表-预警新增
 * @param {Object} params
 */
export function getAdd(params) {
  return request('/api/userDevice/add', {
    method: 'POST',
    body: { ...params },
  })
}
/**
 * 角色列表-预警查询
 * @param {Object} params
 */
export function getDelete(params) {
  return request('/api/userDevice/delete', {
    method: 'POST',
    body: { ...params },
  })
}
/**
 * 角色列表-预警查询
 * @param {Object} params
 */
export function getEdit(params) {
  return request('/api/userDevice/edit', {
    method: 'POST',
    body: { ...params },
  })
}
