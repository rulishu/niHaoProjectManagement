import { request } from '@uiw-admin/utils'

const token = localStorage.getItem('token')
/**
 * 岗位列表-新增
 * @param {Object} params
 */
export function getAdd(params) {
  return request('/api/system/post/add', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 岗位列表-删除
 * @param {Object} params
 */
export function getDelete(params) {
  return request('/api/system/post/remove', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 岗位列表-修改
 * @param {Object} params
 */
export function getEdit(params) {
  return request('/api/system/post/edit', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 岗位列表-修改
 * @param {Object} params
 */
export function getList(params) {
  return request('/api/system/post/list', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
