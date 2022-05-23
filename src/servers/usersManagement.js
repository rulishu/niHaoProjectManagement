import request from '@/utils/request'
// import { request } from '@uiw-admin/utils'

// const token = localStorage.getItem('token')
// 邀请成员
function inviteMember(params) {
  return request('/api/member/inviteMember', {
    method: 'POST',
    // headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
// 邀请团队
function inviteTeam(params) {
  return request('/api/member/inviteTeam', {
    method: 'POST',
    body: { ...params },
  })
}
// 编辑成员
function updateProjectMember(params) {
  return request('/api/member/updateProjectMember', {
    method: 'POST',
    body: { ...params },
  })
}
// 移除成员
function deleteProjectMember(params) {
  return request('/api/member/deleteProjectMember', {
    method: 'POST',
    body: { ...params },
  })
}
// 模糊查询成员
function queryFuzzyAllUser(params) {
  return request('/api/system/user/queryFuzzyAllUser', {
    method: 'POST',
    body: { ...params },
  })
}
// 模糊查询团队
function fuzzyNameQuery(params) {
  return request('/api/ManagerTeam/fuzzyNameQuery', {
    method: 'POST',
    body: { ...params },
  })
}
export {
  inviteMember,
  inviteTeam,
  updateProjectMember,
  deleteProjectMember,
  queryFuzzyAllUser,
  fuzzyNameQuery,
}
