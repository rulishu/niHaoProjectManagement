import { getAdd, getDelete, getEdit } from '@/servers/departmentRefactor' //
import { createModel } from '@rematch/core'

const department = createModel()({
  name: 'departmentRefactor',
  state: {
    // detailsData: {},
    drawerVisible: false,
    tableType: '',
    // drawerVisibleText: '',
    Loading: true,
    // dataSource: [],
    total: 0,
    pageSize: 20,
    page: 1,
    // allEditData: {},
    // alertVisible: false,
    // alertDept: false,
    // topData: {},
    dataSource: [],
    arrSource: [],
    dataSourceTreeData: [],
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 新增
    async getAdd(payload) {
      const dph = dispatch
      const data = await getAdd(payload)
      if (data.code === 200) {
        dph.department.updateState({
          drawerVisible: false,
          Loading: false,
          tableType: '',
        })
        dph.department.getList({})
      }
    },

    // 删除
    async getDelete(payload) {
      const dph = dispatch
      const data = await getDelete(payload)
      if (data.code === 200) {
        dph.department.updateState({
          Loading: false,
        })
        dph.department.getList({})
      }
    },

    // 编辑
    async getEdit(payload) {
      const dph = dispatch
      const data = await getEdit(payload)
      if (data.code === 200) {
        dph.department.updateState({
          drawerVisible: false,
          Loading: false,
          tableType: '',
        })
        dph.department.getList({})
      }
    },
  }),
})

export default department
