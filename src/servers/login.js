import { request } from '@uiw-admin/utils'

/** 第三方登录
 * @param code
 */
function getThirdLoginToken() {
  return request('/api/gitLab/getAuthorConfig', {
    method: 'GET',
  })
}

/** 第三方登录
 * @param code
 */
function authorAndLogin(params) {
  return request(`/api/gitLab/authorAndLogin?code=${params.code}`, {
    method: 'POST',
  })
}

/** 注册
 * @param code
 */
function register(params) {
  return request('/api/register', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export { getThirdLoginToken, authorAndLogin, register }
