import { request } from '@uiw-admin/utils'

/**
 * 查询项目的操作动态
 */
export function selectOperatingRecord(params) {
  return request('/api/project/selectOperatingRecord', {
    method: 'POST',
    body: params,
  })
}
