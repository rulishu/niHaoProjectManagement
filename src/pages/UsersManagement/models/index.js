import { createModel } from '@rematch/core'
import {
  queryPaging,
  inviteMember,
  inviteTeam,
  updateProjectMember,
  deleteProjectMember,
  queryFuzzyAllUser,
  fuzzyNameQuery,
  fuzzyNameS,
  searchUser,
  selectProjectMemberList,
} from '@/servers/usersManagement'

const usersManagement = createModel()({
  name: 'usersManagement',
  state: {
    drawerVisible: false,
    queryInfo: {},
    delectVisible: false,
    userId: '',
    projectId: '',
    tableType: '',
    userIdList: [],
    teamIdList: [],
    groupList: [],
    loading: false,
    activeKey: '1',
    listData: [],
    total: 0,
    memberInfo: {},
    modalVisible: false,
    modalTitle: '',
    userList: [],
    allUserList: [],
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 分页查询成员
    async selectPageList(payload) {
      const dph = dispatch
      const data = await queryPaging(payload)
      if (data.code === 200) {
        dph.usersManagement.updateState({
          listData: data.data.rows,
          total: data.data.total,
        })
      }
    },
    // 邀请成员
    async inviteMember(payload) {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: true,
        tableType: 'member',
        loading: false,
      })
      return await inviteMember(payload)
    },
    // 邀请团队
    async inviteTeam(payload) {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: true,
        tableType: 'group',
        loading: false,
      })
      return await inviteTeam(payload)
    },
    // 编辑成员
    async updateProjectMember(payload) {
      const dph = dispatch
      dph.usersManagement.updateState({
        drawerVisible: true,
        tableType: 'edit',
        loading: false,
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
          label: `${item.nickName} ${item.email}`,
          value: item.userId,
        }))
        dph.usersManagement.updateState({
          userIdList: userIdList,
        })
      }
    },
    // 模糊查询团队
    async fuzzyNameQuery(payload) {
      const dph = dispatch
      const data = await fuzzyNameQuery(payload)
      if (data && data.code === 200) {
        const teamIdList = data?.data.map((item) => ({
          label: item.teamName,
          value: item.id,
        }))
        dph.usersManagement.updateState({
          teamIdList: teamIdList,
        })
      }
    },
    //查询成员不分页
    async selectProjectMemberList(payload) {
      const dph = dispatch
      const data = await selectProjectMemberList(payload)
      if (data && data.code === 200) {
        const allUserList = data?.data.map((item) => {
          return item.userId
        })
        dph.usersManagement.updateState({
          allUserList: allUserList,
        })
      }
    },
    // 模糊查询团队
    async fuzzyNameS(payload) {
      const dph = dispatch
      const data = await fuzzyNameS(payload)
      if (data.code === 200) {
        const teamIdList = data?.data.map((item) => ({
          label: item.teamName,
          value: item.id,
        }))
        dph.usersManagement.updateState({
          groupList: teamIdList,
        })
      }
    },
    // 根据用户账户，昵称模糊查询，根据完整邮箱账户查询
    async searchUser(params) {
      const dph = dispatch
      if (params) {
        const data = await searchUser(params)
        if (data && data.code === 200) {
          const userList = data?.data.map((item) => ({
            label: `${item.nickName} ${item.email}`,
            value: item.userId,
          }))
          dph.usersManagement.updateState({
            userList: userList,
          })
        }
      } else {
        dph.usersManagement.updateState({
          userList: [],
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
