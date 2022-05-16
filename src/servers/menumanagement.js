import { request } from '@uiw-admin/utils'

/**
 * 分页查询菜单目录
 * @page
 * @pageSize
 *
 */
export const queryByPage = (params) => {
  return request('/api/menu/queryByPage', {
    method: 'POST',
    body: params,
  })
}

// 添加菜单
export const addMenu = '/api/menu/addMenu'

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
  return request('/api/menu/addMenu', {
    method: 'POST',
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
