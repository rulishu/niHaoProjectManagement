import request from '@/utils/request'

function getUserInfo(params) {
  return request('/api/userHome/userHome', {
    method: 'POST',
    body: { ...params },
  })
}

// 管理员查看：用户首页（根据用户账户）
function getUserInfoByAccount(params) {
  return request(`/api/userHome/userHomeV1/${params}`, {
    method: 'POST',
  })
}

export { getUserInfo, getUserInfoByAccount }
