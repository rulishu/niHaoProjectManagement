import { createModel } from '@rematch/core'
import { getAdd, getDelete, getEdit, getList } from '@/servers/postManagement'

const postManagement = createModel()({
  name: 'postManagement',
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
    async getAdd(payload, postManagement) {
      const dph = dispatch
      const data = await getAdd(payload)
      if (data.code === 200) {
        dph.postManagement.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        postManagement.postManagement.tablePro.onSearch()
      }
    },
    // 新增
    async getList(payload, postManagement) {
      const dph = dispatch
      const data = await getList(payload)
      if (data.code === 200) {
        dph.postManagement.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        postManagement.postManagement.tablePro.onSearch()
      }
    },
    // 删除
    async getDelete(payload, postManagement) {
      const dph = dispatch
      const data = await getDelete(payload)
      if (data.code === 200) {
        dph.postManagement.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        postManagement.postManagement.tablePro.onSearch()
      }
    },
    // 编辑
    async getEdit(payload, postManagement) {
      const dph = dispatch
      const data = await getEdit(payload)
      if (data.code === 200) {
        dph.postManagement.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        postManagement.postManagement.tablePro.onSearch()
      }
    },
    clean() {
      const dph = dispatch
      dph.postManagement.updateState({
        drawerType: '',
        drawerVisible: false,
        queryInfo: {},
      })
    },
  }),
})
export default postManagement
