import { createModel } from '@rematch/core'
import { getAdd, checkUrlUniqueness } from '@/servers/organizeList'
import { Notify } from 'uiw'

const organizeList = createModel()({
  name: 'organizeList',
  state: {
    addVisible: false,
    loading: false,
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
      const dph = dispatch
      const data = await getAdd(payload)
      if (data.code === 200) {
        dph.organizeList.updateState({
          addVisible: false,
        })
      }
    },

    // 检验路由
    async checkUrlUniqueness(payload) {
      const data = await checkUrlUniqueness(payload)
      if (data.code === 200) {
        Notify.success({ title: data.message })
      } else {
        Notify.error({ title: '检验失败' + data.message })
      }
    },
  }),
})

export default organizeList
