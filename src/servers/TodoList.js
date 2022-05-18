import { request } from '@uiw-admin/utils'

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
