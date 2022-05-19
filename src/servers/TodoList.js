import request from '@/utils/request'
/**
 * 待办事项列表数据
 * @page
 * @pageSize
 *
 */
export const getSelectPage = (params) => {
  return request('/api/ManagerTodoList/selectPage', {
    method: 'POST',
    body: params,
  })
}

export const getStrutsSwitch = (params) => {
  return request('/api/ManagerTodoList/strutsSwitch', {
    method: 'POST',
    body: params,
  })
}

export const getSelectAll = (params) => {
  return request('/api/ManagerTodoList/selectAll', {
    method: 'POST',
    body: params,
  })
}
