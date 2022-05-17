import { request } from '@uiw-admin/utils'

/**
 * 查询项目统计
 */
export function projectCountById(params) {
  return request('/api/project/projectCountById', {
    method: 'POST',
    body: params,
  })
}
