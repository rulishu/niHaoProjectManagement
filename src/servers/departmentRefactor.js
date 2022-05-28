import request from '@/utils/request'

//查询
// function getList(params) {
//   return request('/api/system/dept/listToken', {
//     method: 'POST',
//     // requestType: "urlencoded",
//     body: { ...params },
//   })
// }
// //新增
function getAdd(params) {
  return request('/api/system/dept/add', {
    method: 'POST',
    body: { ...params },
  })
}
// //删除
function getDelete(params) {
  return request('/api/system/dept/remove', {
    method: 'POST',
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

// 根据ID获取部门详情
function getInfoData(params) {
  return request('/api/system/dept/listToken/exclude', {
    method: 'POST',
    body: { ...params },
  })
}
// //编辑
function getEdit(params) {
  return request('/api/system/dept/edit', {
    method: 'POST',
    body: { ...params },
  })
}
export { getAdd, getDelete, getEdit, judge, getInfoData }
//
