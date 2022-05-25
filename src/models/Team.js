// import { Notify } from 'uiw'
import { createModel } from '@rematch/core'
import {
  addTeam,
  editTeam,
  getPageTeam,
  deleteTeamById,
  getTeamInfoById,
  // 团队成员操作相关API
  // addTeamMember,
  // deleteTeamMemberById,
  // getCurrentUserAllItem,
  getMemberByTeamId,
  getTeamMemberList,
  // editTeamMemberInfo,
} from '../servers/team'

const team = createModel()({
  name: 'team',
  state: {
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 0,
    dataList: [], // 数据列表源
    teamData: {}, // 当前团队数据
    teamMemberList: [], // 团队成员数据
    drawerVisible: false,
    tableType: '',
    queryInfo: {},
    isView: false,
    alertShow: false,
    loading: false,
    tablePro: {},
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
      const { params } = payload
      const data = await addTeam(params)
      if (data.code === 200) {
        dph.team.updateState({
          drawerVisible: false,
          drawerVisiText: '',
        })
        team.team.tablePro.onSearch()
      }
      console.log('新增团队', data)
    },
    // 根据团队 ID 删除团队
    async deleteTeamById(params, team) {
      const data = await deleteTeamById(params)
      console.log('删除团队', data)
    },
    // 修改团队
    async editTeam(payload, team) {
      const { param } = payload
      const data = await editTeam(param)
      console.log('修改团队', data)
    },
    // 分页查找团队
    async getPageTeam(params, { team }) {
      const param = { page: 1, pageSize: 10, ...params }
      const data = await getPageTeam(param)
      if (data && data.code === 200) {
        dispatch.team.update({
          dataList: data?.data?.list,
        })
      }
    },
    // 通过团队id查询团队信息
    async getTeamInfoById(params) {
      const data = await getTeamInfoById(params)
      if (data && data.code === 200) {
        dispatch.team.update({
          teamData: data.data,
        })
      }
    },
    // 分页查询用户列表数据
    async getTeamMemberList(payload) {
      const params = { page: 1, pageSize: 10, ...payload }
      const data = await getTeamMemberList(params)
      if (data && data.code === 200) {
        dispatch.team.update({
          teamMemberList: data?.data?.list,
        })
      }
    },
    // 通过团队id查询团队成员信息
    async getMemberByTeamId(params) {
      const data = await getMemberByTeamId(params)
      if (data && data.code === 200) {
        dispatch.team.update({
          teamMemberList: data?.data,
        })
      }
    },
    clean() {
      const dph = dispatch
      dph.team.updateState({
        drawerVisible: false,
        loading: false,
        tableType: '',
        queryInfo: {},
        isView: false,
      })
    },
  }),
})

export default team
