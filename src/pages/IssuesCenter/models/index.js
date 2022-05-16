import { createModel } from '@rematch/core'

const doc = createModel()({
  name: 'issues_center',
  state: {
    activeKey: 'open',
  },
  reducers: {
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: (dispatch) => ({
    async verify() {
      const dph = dispatch
      dph.doc.updateState({
        test: '测试2',
      })
    },
  }),
})
export default doc
