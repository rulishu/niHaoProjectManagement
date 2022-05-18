import { request as originalRequest } from '@uiw-admin/utils'

const token = localStorage.getItem('token')

const request = (url, param = {}) => {
  return originalRequest(url, {
    headers: { Authorization: 'Bearer ' + token },
    ...param,
  })
}

export default request
