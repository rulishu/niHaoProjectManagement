// import { Notify } from 'uiw'
import { createModel } from '@rematch/core'
import { getUrlType } from '../servers/url'

const url = createModel()({
  name: 'url',
  state: {
    linkedId: 1, // 用户/组织 ID
    linkedType: 1, // 1 : 用户 2 : 组织
    url: '',
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 分页查找团队
    async getPageTeam(payload, { url }) {
      const { params, callback } = payload
      const data = await getUrlType(params)
      if (data && data.code === 200) {
        localStorage.setItem('linkedData', JSON.stringify(data?.data))
        callback && callback(data?.data)
        dispatch?.url.updateState({
          url: data?.data?.url,
          linkedId: data?.data?.linkedId,
          linkedType: data?.data?.linkedType,
        })
      }
    },
  }),
})

export default url
