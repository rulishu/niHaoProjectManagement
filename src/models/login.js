import { history } from '@uiw-admin/router-control';
import { createModel } from '@rematch/core';
const login = createModel()({
  name: 'login',
  state: {
    userData: null,
    token: null
  },
  reducers: {
    updateState: (state, payload) => ({ ...state,
      ...payload
    })
  },
  effects: dispatch => ({
    async submit() {
      dispatch.login.updateState({
        token: '测试2'
      });
      sessionStorage.setItem('auth', JSON.stringify(['/home', '/dac']));
      history.push('/home'); // this.updateState()
      // await login({ username: 'test', password: 'www' });
      // dispatch.sharks.increment(payload)
      // `dispatch.s` will suggest `sharks`
    }

  })
});
export default login;