import { request } from '@uiw-admin/utils'

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
export const addRole = '/api/managerRole/addRole'

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
