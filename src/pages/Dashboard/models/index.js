import { createModel } from '@rematch/core';
const doc = createModel()({
  name: 'docDs',
  state: {
    test: 'doc model'
  },
  reducers: {
    updateState: (state, payload) => ({ ...state,
      ...payload
    })
  },
  effects: dispatch => ({
    async verify() {
      const dph = dispatch;
      dph.doc.updateState({
        test: '测试2'
      });
    }

  })
});
export default doc;