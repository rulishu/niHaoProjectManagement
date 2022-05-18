import { request } from '@uiw-admin/utils'
const token = localStorage.getItem('token')
/**
 * 分页查询菜单目录
 * @page
 * @pageSize
 *
 */
export const queryByPage = (params) => {
  return request('/api/system/menu/list', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
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
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
}
// 获取用户信息
export const getRouters = () => {
  return request('/api/getRouters', {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  })
}
