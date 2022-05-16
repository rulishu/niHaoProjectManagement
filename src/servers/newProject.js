import { request } from '@uiw-admin/utils'

/**
 * 新增项目
 */
export function addProject(params) {
  return request('/api/project/add', {
    method: 'POST',
    body: { ...params },
  })
}
