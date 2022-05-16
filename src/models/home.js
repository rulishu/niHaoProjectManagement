import { createModel } from '@rematch/core';
const home = createModel()({
  name: 'home',
  state: {
    test: 'home'
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
        test: 'homg2323'
      });
    }

  })
});
export default home;