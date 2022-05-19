import { createModel } from '@rematch/core'
import {
  inviteMember,
  updateProjectMember,
  deleteProjectMember,
  queryFuzzyAllUser,
} from '../../../servers/usersManagement'

const usersManagement = createModel()({
  name: 'usersManagement',
  state: {
    drawerVisible: false,
    queryInfo: {},
    delectVisible: false,
    id: '',
    tableType: '',
    userIdList: [],
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
        tableType: 'member',
      })
      return await inviteMember(payload)
    },
    // 编辑成员
    async updateProjectMember(payload) {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: true,
        tableType: 'edit',
      })
      return await updateProjectMember(payload)
    },
    // 移除成员
    async deleteProjectMember(payload) {
      const dph = dispatch
      dph.usersManagement.updateState({
        delectVisible: false,
        tableType: 'del',
      })
      return await deleteProjectMember(payload)
    },
    // 模糊查询成员
    async queryFuzzyAllUser(payload) {
      const dph = dispatch
      const data = await queryFuzzyAllUser(payload)
      if (data.code === 200) {
        const userIdList = data?.rows.map((item) => ({
          label: item.userName,
          value: item.userId,
        }))
        dph.usersManagement.updateState({
          userIdList: userIdList,
        })
      }
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
