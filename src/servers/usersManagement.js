import request from '@/utils/request'

// 邀请成员
function inviteMember(params) {
  return request('/api/member/inviteMember', {
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
const deleteProjectMember = '/api/member/deleteProjectMember'

export { inviteMember, updateProjectMember, deleteProjectMember }
