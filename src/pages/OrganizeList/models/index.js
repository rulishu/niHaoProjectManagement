import { createModel } from '@rematch/core'
import { getAdd, checkUrlUniqueness } from '@/servers/organizeList'

const organizeList = createModel()({
  name: 'organizeList',
  state: {
    addVisible: false,
    loading: false,
    search: '',
    routeMatch: { type: 0, title: '请输入正确的路由' },
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 新建组织
    async getAdd(payload) {
      const { search, ...param } = payload
      const dph = dispatch
      const data = await getAdd(param)
      if (data.code === 200) {
        dph.organizeList.updateState({
          addVisible: false,
        })
        search()
      }
    },

    // 检验路由
    async checkUrlUniqueness(payload) {
      const dph = dispatch
      const data = await checkUrlUniqueness(payload)
      if (data.code === 200) {
        // Notify.success({ title: data.message })
        dph.organizeList.updateState({
          routeMatch: { type: 1, title: '路由正确' },
        })
      } else {
        // Notify.error({ title: '检验失败' + data.message })
        dph.organizeList.updateState({
          routeMatch: { type: 2, title: '路由不正确' },
        })
      }
    },
  }),
})

export default organizeList
