// import { request } from '@uiw-admin/utils'
import request from '@/utils/request'
/**
 * 查询项目统计
 */
export function getProjectCountById(params) {
  return request('/api/project/projectCountById', {
    method: 'POST',
    body: params,
  })
}

/**
 * 查询项目动态
 */
export function getProjectDynamics(params) {
  return request('/api/project/projectDynamics', {
    method: 'POST',
    body: params,
  })
}

/**
 * 查询项目成员
 */
export function getProjectMembers(params) {
  return request('/api/project/projectMembers', {
    method: 'POST',
    body: params,
  })
}

/**
 * 查询项目概览：任务列表
 */
export function getProjectOverview(params) {
  return request('/api/ManagerAssignment/projectOverview', {
    method: 'POST',
    body: params,
  })
}
