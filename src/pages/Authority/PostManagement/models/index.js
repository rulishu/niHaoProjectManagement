import { createModel } from '@rematch/core'
import { getAdd, getDelete, getEdit } from '@/servers/local'

const local = createModel()({
  name: 'local',
  state: {
    drawerType: '',
    drawerVisible: false,
    queryInfo: {},
    alertShow: false,
    ids: null,
    tablePro: {},
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 新增
    async getAdd(payload, local) {
      const dph = dispatch
      const data = await getAdd(payload)
      if (data.code === 1) {
        dph.local.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        local.local.tablePro.onSearch()
      }
    },
    // 删除
    async getDelete(payload, local) {
      const dph = dispatch
      const data = await getDelete(payload)
      if (data.code === 1) {
        dph.local.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        local.local.tablePro.onSearch()
      }
    },
    // 编辑
    async getEdit(payload, local) {
      const dph = dispatch
      const data = await getEdit(payload)
      if (data.code === 1) {
        dph.local.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        local.local.tablePro.onSearch()
      }
    },
    clean() {
      const dph = dispatch
      dph.local.updateState({
        drawerType: '',
        drawerVisible: false,
        queryInfo: {},
      })
    },
  }),
})
export default local
