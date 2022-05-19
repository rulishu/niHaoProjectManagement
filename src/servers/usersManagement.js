// import request from '@/utils/request'
import { request } from '@uiw-admin/utils'

const token = localStorage.getItem('token')
// 邀请成员
function inviteMember(params) {
  return request('/api/member/inviteMember', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
// 编辑成员
function updateProjectMember(params) {
  return request('/api/member/updateProjectMember', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: { ...params },
  })
}
// // 移除成员
// function deleteProjectMember(params) {
//   return request('/api/member/deleteProjectMember', {
//     method: 'POST',
//     headers: { Authorization: 'Bearer ' + token },
//     body: { ...params },
//   })
// }

// 移除成员
const deleteProjectMember = '/api/member/deleteProjectMember'

export { inviteMember, updateProjectMember, deleteProjectMember }
