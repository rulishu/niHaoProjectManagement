import request from '@/utils/request'

/**
 * 获取组织下的项目
 */
export function selectOrganizationProject(params) {
  return request('/api/organization/selectOrganizationProject', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 获取组织下的项目
 */
export function getAdd(params) {
  return request('/api/organization/add', {
    method: 'POST',
    body: { ...params },
  })
}

//
export function checkUrlUniqueness(params) {
  return request('/api/organization/checkUrlUniqueness', {
    method: 'POST',
    body: { ...params },
  })
}
