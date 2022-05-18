import { request } from '@uiw-admin/utils'

const token = localStorage.getItem('token')
/**
 * 角色新增
 * @param {Object} params
 */
export function getAdd(params) {
  return request('/api/system/role/add', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 角色删除
 * @param {Object} params
 */
export function getDelete(params) {
  return request('/api/system/role/remove', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 角色修改
 * @param {Object} params
 */
export function getEdit(params) {
  return request('/api/system/role/edit', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 根据角色编号获取详细信息
 * @param {Object} params
 */
export function getInfo(params) {
  return request('/api/system/role/getInfo', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 获取菜单下拉树列表
 * @param {Object} params
 */
export function getTreeSelect(params) {
  return request('/api/system/menu/treeselect', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 加载对应角色菜单列表树
 * @param {Object} params
 */
export function roleMenuTreeselect(params) {
  return request(`/api/system/menu/roleMenuTreeselect/${params}`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
/**
 * 角色状态修改
 * @param {Object} params
 */
export const changeStatus = (params) => {
  return request('/api/system/role/changeStatus', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: params,
  })
}
/**
 * 查询角色
 * @page
 * @pageSize
 *
 */
export const selectRole = (params) => {
  return request('/api/managerRole/selectRole', {
    method: 'POST',
    body: params,
  })
}

// 单个角色添加
export const addRole = '/api/system/role'

// 单个角色更新
export const upDateRole = '/api/managerRole/upDateRole'

// 单个角色删除
export const deleteRole = (params) => {
  return request('/api/managerRole/deleteRole', {
    method: 'POST',
    body: params,
  })
}

// 单个角色状态更新
export const upDateStatusRole = (params) => {
  return request('/api/managerRole/upDateStatus', {
    method: 'POST',
    body: params,
  })
}

// 获取所有的角色列表
export const getAllRoleList = (params) => {
  return request('/api/managerRole/selectRoleList', {
    method: 'POST',
    body: params,
  })
}

// 查询所有菜单树型展示
export const menuTiers = (params) => {
  return request('/api/menu/menuTiers', {
    method: 'POST',
    body: params,
  })
}

// 添加角色菜单授权
export const addMenu = '/api/managerRole/addMenu'

//根据角色id查询正常的菜单
export const selectListByRoleId = (params) => {
  return request('/api/managerRole/selectListByRoleId', {
    method: 'POST',
    body: params,
  })
}
