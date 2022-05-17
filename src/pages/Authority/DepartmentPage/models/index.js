import {
  getList,
  getAdd,
  getDelete,
  getEdit,
  judge,
} from '@/servers/department' //
import { Notify } from 'uiw'
import { createModel } from '@rematch/core'

const department = createModel()({
  name: 'department',
  state: {
    detailsData: {},
    drawerVisible: false,
    drawerVisibleText: '',
    Loading: true,
    dataSource: [],
    total: 0,
    pageSize: 20,
    page: 1,
    allEditData: {},
    alertVisible: false,
    alertDept: false,
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    // 查询
    async getList(payload, department) {
      const dph = dispatch
      const data = await getList({
        deptName: payload?.deptName || '',
        page: department?.department?.page,
        pageSize: department?.department?.pageSize,
      })
      //  const data = await getList(payload);
      if (data.code === 200) {
        // // Notify.success({ title: "操作成功" });
        dph.department.updateState({
          drawerVisible: false,
          Loading: false,
          drawerVisibleText: '',
          dataSource: data?.data?.rows || [],
          total: data?.data?.total || [],
        })
      } else {
        Notify.error({ title: '失败通知' })
      }
    },

    // 新增
    async getAdd(payload) {
      const dph = dispatch
      const data = await getAdd(payload)
      if (data.code === 200) {
        dph.department.updateState({
          drawerVisible: false,
          Loading: false,
          drawerVisibleText: '',
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
      } else {
        Notify.error({ title: '失败通知', description: data?.message })
      }
    },
    // 判断是否存在下级
    async judge(payload) {
      const dph = dispatch
      const data = await judge(payload)
      if (data.code === 200) {
        dph.department.updateState({
          alertDept: data.data?.length > 0 ? true : false,
        })
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
          drawerVisibleText: '',
        })
        dph.department.getList({})
      }
    },
  }),
})

export default department
