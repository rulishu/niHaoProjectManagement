import request from '@/utils/request'
// import { request } from '@uiw-admin/utils'

// 分页查询成员
function queryPaging(params) {
  return request('/api/member/selectProjectMember', {
    method: 'POST',
    body: { ...params },
  })
}

// 邀请成员
function inviteMember(params) {
  return request('/api/member/inviteMember', {
    method: 'POST',
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
  return request('/api/project/getSameProjectUser', {
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

// 查询用户所在团队
function fuzzyNameS(params) {
  return request('/api/ManagerTeam/fuzzyNameS', {
    method: 'POST',
    body: { ...params },
  })
}
// 根据用户账户，昵称模糊查询，根据完整邮箱账户查询
function searchUser(params) {
  return request(`/api/system/user/searchUser/${params}`, {
    method: 'POST',
    requestType: 'urlencoded',
    body: params,
  })
}
export {
  queryPaging,
  inviteMember,
  inviteTeam,
  updateProjectMember,
  deleteProjectMember,
  queryFuzzyAllUser,
  fuzzyNameQuery,
  fuzzyNameS,
  searchUser,
}
