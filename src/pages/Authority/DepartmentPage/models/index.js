import {
  getList,
  getAdd,
  getDelete,
  getEdit,
  judge,
  getInfoData,
  queryFuzzyAllUser,
} from '@/servers/department' //
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
    topData: {},
    userIdList: [],
    dataList: [],
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
        ...payload,
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
          dataSource: data?.data || [],
        })
      }
    },

    // 根据ID获取信息
    async getInfoData(payload) {
      const dph = dispatch
      const data = await getInfoData({ id: payload?.editData?.deptId })
      if (data.code === 200) {
        const dataParent = data?.data.find(
          (code) => code.deptId === payload?.editData?.parentId
        )
        dph.department.updateState({
          topData: dataParent,
        })
        // dph.department.getList({})
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

    // 模糊查询成员
    async queryFuzzyAllUser(payload) {
      const dph = dispatch
      const data = await queryFuzzyAllUser(payload)
      if (data.code === 200) {
        const userIdList = data?.rows.map((item) => ({
          label: item.nickName,
          value: item.userId,
        }))
        dph.department.updateState({
          userIdList: userIdList,
          dataList: data?.rows,
        })
      }
    },
  }),
})

export default department
