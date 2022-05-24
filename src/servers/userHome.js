import request from '@/utils/request'

function getUserInfo(params) {
  return request('/api/userHome/userHome', {
    method: 'POST',
    body: { ...params },
  })
}

export { getUserInfo }
