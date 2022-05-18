import request from '@/utils/request'

// 邀请成员
function inviteMember(params) {
  return request('/api/member/inviteMember', {
    method: 'POST',
    body: { ...params },
  })
}

export { inviteMember }
