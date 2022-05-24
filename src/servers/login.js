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

export { getThirdLoginToken, authorAndLogin }
