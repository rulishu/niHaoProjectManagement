import { createModel } from '@rematch/core'
import { Notify } from 'uiw'
import {
  addTeam,
  editTeam,
  getPageTeam,
  deleteTeamById,
  // 团队成员操作相关API
  getMembers,
  getNotTeamUsers,
  updateMembers,
} from '../../../servers/team'

const team = createModel()({
  name: 'team',
  state: {
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 0,
    dataList: [], // 数据列表源
    teamData: [], // 当前未加入团队成员数据
    teamMemberList: [], // 团队成员数据
    userIdList: [],
    drawerVisible: false,
    drawerType: '',
    queryInfo: {},
    isView: false,
    alertShow: false,
    loading: false,
    tablePro: {},
    id: null,
    teamId: null,
    isUsers: false,
    saveState: false,
    modalState: false,
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 新增团队
    async addTeam(payload, team) {
      const dph = dispatch
      dph.team.updateState({
        saveState: true,
      })
      const data = await addTeam(payload)
      if (data.code === 200) {
        dph.team.updateState({
          drawerVisible: false,
          saveState: false,
        })
        team.team.tablePro.onSearch()
      } else {
        dph.team.updateState({
          saveState: false,
        })
      }
    },
    // 根据团队 ID 删除团队
    async deleteTeamById(payload, team) {
      const dph = dispatch
      const data = await deleteTeamById(payload)
      if (data.code === 200) {
        dph.team.updateState({
          drawerVisible: false,
        })
        team.team.tablePro.onSearch()
      }
    },
    // 修改团队
    async editTeam(payload, team) {
      const dph = dispatch
      dph.team.updateState({
        saveState: true,
      })
      const data = await editTeam(payload)
      if (data.code === 200) {
        dph.team.updateState({
          drawerVisible: false,
          saveState: false,
        })
        team.team.tablePro.onSearch()
      } else {
        dph.team.updateState({
          saveState: false,
        })
      }
    },
    //  团队成员管理，修改团队成员
    async updateMembers(payload, team) {
      const dph = dispatch
      dph.team.updateState({
        modalState: true,
      })
      const data = await updateMembers(payload)
      if (data.code === 200) {
        dph.team.updateState({
          isUsers: false,
          modalState: false,
        })
        Notify.success({ title: data.message })
        team.team.tablePro.onSearch()
      } else {
        dph.team.updateState({
          modalState: false,
        })
      }
    },
    // 分页查找团队
    async getPageTeam(params) {
      const param = { page: 1, pageSize: 10, ...params }
      const data = await getPageTeam(param)
      if (data && data.code === 200) {
        const arr = []
        data.data.rows.forEach((item) => {
          arr.push({
            label: item.id,
          })
        })
        dispatch.team.updateState({
          dataList: data?.data?.rows,
          teamId: arr,
        })
      }
    },
    // 获取团队下成员信息--可根据部门筛选
    async getMembers(payload) {
      const data = await getMembers(payload)
      if (data && data.code === 200) {
        const arr = []
        data.data.forEach((item) => {
          arr.push({
            label: item.nickName,
            value: item.userId,
            account: item.userName,
          })
        })
        dispatch.team.updateState({
          teamMemberList: arr,
        })
      }
    },
    // 获取未加入团队用户列表--可根据部门筛选
    async getNotTeamUsers(params) {
      const data = await getNotTeamUsers(params)
      if (data && data.code === 200) {
        const arr = []
        data.data.forEach((item) => {
          arr.push({
            label: item.nickName,
            value: item.userId,
            account: item.userName,
          })
        })
        dispatch.team.updateState({
          teamData: arr,
        })
      }
    },
    clean() {
      const dph = dispatch
      dph.team.updateState({
        drawerVisible: false,
        drawerType: '',
        queryInfo: {},
        isView: false,
      })
    },
  }),
})

export default team
