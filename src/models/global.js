import { createModel } from '@rematch/core';
const global = createModel()({
  name: 'global',
  state: {
    test: '测试全局State'
  },
  reducers: {
    updateState: (state, payload) => ({ ...state,
      ...payload
    })
  },
  effects: dispatch => ({
    async verify() {
      const dph = dispatch;
      dph.global.updateState({
        test: '测试2'
      });
    }

  })
});
export default global;