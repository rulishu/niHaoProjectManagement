import { createModel } from '@rematch/core'
import { addProjectMember } from '../../../servers/usersManagement'

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
    async addProjectMember(payload) {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: true,
        tableType: '',
      })
      return await addProjectMember(payload)
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
