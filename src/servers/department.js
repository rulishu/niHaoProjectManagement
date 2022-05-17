import { request } from '@uiw-admin/utils'

//查询
function getList(params) {
  return request('/api/dept/selectList', {
    method: 'POST',
    // requestType: "urlencoded",
    body: { ...params },
  })
}
// //新增
function getAdd(params) {
  return request('/api/dept/add', {
    method: 'POST',
    body: { ...params },
  })
}
// //删除
function getDelete(params) {
  return request('/api/dept/remove', {
    method: 'POST',
    requestType: 'urlencoded',
    body: { ...params },
  })
}
// //判断是否存在下级
function judge(params) {
  return request('/api/dept/judgeSubset', {
    method: 'POST',
    requestType: 'urlencoded',
    body: { ...params },
  })
}

// //编辑
function getEdit(params) {
  return request('/api/dept/edit', {
    method: 'POST',
    body: { ...params },
  })
}
export { getList, getAdd, getDelete, getEdit, judge }
