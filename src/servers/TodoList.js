import request from '@/utils/request'
/**
 * 待办事项列表数据
 * @page
 * @pageSize
 *
 */
// 待办分页查询
export const getSelectPage = (params) => {
  return request('/api/ManagerTodoList/selectPage', {
    method: 'POST',
    body: params,
  })
}

//待办事项转换
export const getStrutsSwitch = (params) => {
  return request('/api/ManagerTodoList/strutsSwitch', {
    method: 'POST',
    body: params,
  })
}
//查询所有待办
export const getSelectAll = (params) => {
  return request('/api/ManagerTodoList/selectAll', {
    method: 'POST',
    body: params,
  })
}

//指派人查询
export const getselectAssignUser = (params) => {
  return request('/api/ManagerTodoList/selectAssignUser', {
    method: 'POST',
    body: params,
  })
}

//获取所有用户项目
export const getselectAllUserProject = (params) => {
  return request('/api/project/selectAllUserProject', {
    method: 'POST',
    body: params,
  })
}
