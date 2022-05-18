import { request } from '@uiw-admin/utils'

/**
 * 查询任务列表数据
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
