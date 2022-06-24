import { request } from '@uiw-admin/utils'

/**
 * 获取组织下的项目
 */
export function selectOrganizationProject(params) {
  return request('/api/organization/selectOrganizationProject', {
    method: 'POST',
    body: { ...params },
  })
}
