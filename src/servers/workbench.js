import request from '@/utils/request'

/*
 * 我近期参与的项目统计
 */
export function myProject(params) {
  return request('/api/workbench/myProject', {
    method: 'POST',
    body: params,
  })
}

/*
 * 成员动态
 */
export function memberOperator(params) {
  return request('/api/workbench/memberOperator', {
    method: 'POST',
    body: params,
  })
}

/*
 * 查询所有任务
 */
export function selectAllProjectPage(params) {
  return request('api/workbench/selectAllProjectPage', {
    method: 'POST',
    body: params,
  })
}

/*
 * 查询个人任务
 */
export function selectProjectPage(params) {
  return request('api/workbench/selectProjectPage', {
    method: 'POST',
    body: params,
  })
}

/**
 * 待办事项列表数据
 * @page
 * @pageSize
 *
 */
export const getSelectPage = (params) => {
  return request('/api/ManagerTodoList/selectUserTodoPage', {
    method: 'POST',
    body: params,
  })
}
