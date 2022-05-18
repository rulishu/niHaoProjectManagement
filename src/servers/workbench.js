import { request } from '@uiw-admin/utils'

const token = localStorage.getItem('token')
/*
 * 我近期参与的项目统计
 */
export function myProject(params) {
  return request('/api/workbench/myProject', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: params,
  })
}

/*
 * 成员动态
 */
export function memberOperator(params) {
  return request('/api/workbench/memberOperator', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: params,
  })
}

/*
 * 查询所有任务
 */
export function selectAllProjectPage(params) {
  return request('api/workbench/selectAllProjectPage', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: params,
  })
}

/*
 * 查询个人任务
 */
export function selectProjectPage(params) {
  return request('api/workbench/selectProjectPage', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: params,
  })
}
