import { createModel } from '@rematch/core'
// import {
//   queryProject,
// } from '@/servers/projectList'
const global = createModel()({
  name: 'global',
  state: {
    test: '测试全局State',
    drawerVisible: false, //新增项目或编辑项目的弹出框
    seachValue: {}, //新增项目或编辑项目的更改的内容
    drawerType: 'add', //新增项目或编辑项目
    isView: false,
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    async verify() {
      const dph = dispatch
      dph.global.updateState({
        test: '测试2',
      })
    },
    async updataProject(params) {
      const dph = dispatch
      if (params.drawerType === 'add') {
        dph.global.updateState({
          drawerType: 'add',
          drawerVisible: true,
          isView: false,
        })
      } else {
        delete params.drawerType
        // const data = await queryProject(params)
        dph.global.updateState({
          // seachValue: data.data,
          drawerType: 'edit',
          drawerVisible: true,
          isView: false,
        })
      }
    },
  }),
})
export default global
