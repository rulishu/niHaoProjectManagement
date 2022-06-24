import { createModel } from '@rematch/core'
import { selectOrganizationProject } from '@/servers/organizeList'

const organizeList = createModel()({
  name: 'organizeList',
  state: {
    drawerVisible: false,
    queryInfo: {},
    delectVisible: false,
    userId: '',
    projectId: '',
    tableType: '',
    userIdList: [],
    teamIdList: [],
    groupList: '',
    loading: false,
    activeKey: '1',
    listData: [],
    total: 0,
    memberInfo: {},
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 获取组织下的项目
    async selectOrganizationProject(payload) {
      const dph = dispatch
      const data = await selectOrganizationProject(payload)
      if (data.code === 200) {
        dph.organizeList.updateState({
          listData: data.data.rows,
          total: data.data.total,
        })
      }
    },
  }),
})

export default organizeList
