import { createModel } from '@rematch/core'
const global = createModel()({
  name: 'global',
  state: {
    test: '测试全局State',
    drawerVisible: false, //新增项目或编辑项目的弹出框
    seachValue: {}, //新增项目或编辑项目的更改的内容
    drawerType: 'add', //新增项目或编辑项目
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
  }),
})
export default global
