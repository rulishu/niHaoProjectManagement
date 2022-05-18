import { request as originalRequest } from '@uiw-admin/utils'

const request = (url, param = {}) => {
  const token = localStorage.getItem('token')
  return originalRequest(url, {
    headers: { Authorization: 'Bearer ' + token },
    ...param,
  })
}

export default request
