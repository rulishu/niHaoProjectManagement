import { request } from '@uiw-admin/utils'

const token = localStorage.getItem('token')
console.log('token', token)
/**
 * 查询项目的操作动态
 */
export function selectOperatingRecord(params) {
  return request('/api/project/selectOperatingRecord', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: params,
  })
}

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
