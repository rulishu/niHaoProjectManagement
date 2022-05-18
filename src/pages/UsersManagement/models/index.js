import { createModel } from '@rematch/core'
import { inviteMember } from '../../../servers/usersManagement'

const usersManagement = createModel()({
  name: 'usersManagement',
  state: {
    drawerVisible: false,
    queryInfo: {},
    delectVisible: false,
    id: '',
    tableType: '',
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 邀请成员
    async inviteMember(payload) {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: true,
        tableType: '',
      })
      return await inviteMember(payload)
    },

    clean() {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: false,
        queryInfo: {},
        delectVisible: false,
        loading: false,
        tableType: '',
      })
    },
  }),
})

export default usersManagement
