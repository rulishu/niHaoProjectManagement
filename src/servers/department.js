import { request } from '@uiw-admin/utils'

const token = localStorage.getItem('token')
//查询
function getList(params) {
  return request('/api/system/dept/list', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    // requestType: "urlencoded",
    body: { ...params },
  })
}
// //新增
function getAdd(params) {
  return request('/api/system/dept/add', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
// //删除
function getDelete(params) {
  return request('/api/dept/remove', {
    method: 'POST',
    requestType: 'urlencoded',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
// //判断是否存在下级
function judge(params) {
  return request('/api/dept/judgeSubset', {
    method: 'POST',
    requestType: 'urlencoded',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}

// 根据ID获取部门详情
function getInfoData(params) {
  return request('/api/system/dept/list/exclude', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
// //编辑
function getEdit(params) {
  return request('/api/system/dept/edit', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
export { getList, getAdd, getDelete, getEdit, judge, getInfoData }
//
