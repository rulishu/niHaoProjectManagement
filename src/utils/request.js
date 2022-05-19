import { request as uiwRequest } from '@uiw-admin/utils'

/**
 * 请求接口
 * @param {String} url 请求地址
 * @param {Object} param 请求参数
 * @param {Boolean} useToken 是否带token
 * @returns {Promise}
 */

const request = (url, param = {}, useToken = true) => {
  const headers = {
    ...param.headers,
  }
  // 是否接口带token
  if (useToken) {
    const token = localStorage.getItem('token')

    headers.Authorization = `Bearer ${token}`
  }
  return uiwRequest(url, {
    ...param,
    headers,
  })
}

export default request
