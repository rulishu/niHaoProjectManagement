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
  // editTeamMemberInfo,
} from '../../../servers/team'

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
    drawerType: '',
    queryInfo: {},
    isView: false,
    alertShow: false,
    loading: false,
    tablePro: {},
    id: null,
    isUsers: false,
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
      const data = await addTeam(payload)
      if (data.code === 200) {
        dph.team.updateState({
          drawerVisible: false,
        })
        team.team.tablePro.onSearch()
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
      const data = await editTeam(payload)
      if (data.code === 200) {
        dph.team.updateState({
          drawerVisible: false,
        })
        team.team.tablePro.onSearch()
      }
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
        drawerType: '',
        queryInfo: {},
        isView: false,
      })
    },
  }),
})

export default team
