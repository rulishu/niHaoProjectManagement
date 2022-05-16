import { createModel } from '@rematch/core'
import { selectById } from '../../../servers/usersManagement'

const usersManagement = createModel()({
  name: 'usersManagement',
  state: {
    drawerVisible: false,
    queryInfo: {},
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    async selectById(payload) {
      const dph = dispatch
      const data = await selectById(payload)
      if (data.code === 200) {
        dph.usersManagement.updateState({
          drawerVisible: true,
          queryInfo: data.data || {},
        })
      }
    },

    clean() {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: false,
        queryInfo: {},
        loading: false,
      })
    },
  }),
})

export default usersManagement
