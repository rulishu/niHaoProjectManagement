import request from '@/utils/request'

/**
 * 获取菜单列表
 * @param {Object} params
 */
export const getList = (params) => {
  return request('/api/system/menu/list', {
    method: 'POST',
    body: params,
  })
}
/**
 * 菜单新增
 * @param {Object} params
 */
export function getAdd(params) {
  return request('/api/system/menu/add', {
    method: 'POST',
    body: { ...params },
  })
}
/**
 * 菜单删除
 * @param {Object} params
 */
export function getDelete(params) {
  return request(`/api/system/menu/remove/${params}`, {
    method: 'POST',
    body: { ...params },
  })
}
/**
 * 菜单修改
 * @param {Object} params
 */
export function getEdit(params) {
  return request('/api/system/menu/edit', {
    method: 'POST',
    body: { ...params },
  })
}

/**
 * 分页查询菜单目录
 * @page
 * @pageSize
 *
 */
export const queryByPage = (params) => {
  return request('/api/system/menu/list', {
    method: 'GET',
    body: params,
  })
}

// 添加菜单
export const addMenu = '/api/system/menu'

// 更新菜单
export const updateMenu = '/api/menu/updateMenu'

// 根据id删除菜单
export const deleteById = (params) => {
  return request('/api/menu/deleteById', {
    method: 'POST',
    body: params,
  })
}

// 根据id查询菜单
export const upDateStatusMenu = (params) => {
  return request(`/api/menu/selectCompany/${params}`, {
    method: 'POST',
    body: params,
  })
}

// 添加菜单
export const addMenuData = (params) => {
  return request('/api/system/menu', {
    method: 'GET',
    body: params,
  })
}

// 编辑菜单
export const editMenu = (params) => {
  return request('/api/menu/updateMenu', {
    method: 'POST',
    body: params,
  })
}
// 获取用户信息
export const getInfo = () => {
  return request('/api/getInfo', {
    method: 'GET',
  })
}
// 获取用户信息
export const getRouters = () => {
  return request('/api/getRouters', {
    method: 'GET',
  })
}
