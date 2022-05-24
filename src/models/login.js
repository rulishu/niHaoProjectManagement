import { history } from '@uiw-admin/router-control'
import { createModel } from '@rematch/core'
import { getThirdLoginToken, authorAndLogin } from '../servers/login'

const login = createModel()({
  name: 'login',
  state: {
    userData: null,
    token: null,
  },
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch) => ({
    async submit() {
      dispatch.login.updateState({
        token: '测试2',
      })
      sessionStorage.setItem('auth', JSON.stringify(['/home', '/dac']))
      history.push('/home') // this.updateState()
      // await login({ username: 'test', password: 'www' });
      // dispatch.sharks.increment(payload)
      // `dispatch.s` will suggest `sharks`
    },

    async getThirdLoginToken() {
      const data = await getThirdLoginToken()
      // console.log(data.data)
      // debugger
      if (data && data.data) {
        window.location.href = data.data.gitLabUrl
      }
    },

    async thirdLogin(param) {
      const data = await authorAndLogin(param)
      if (data && data.code === 200) {
        localStorage.setItem('token', data.data.token)
        // dispatch.login.updateState({ token: data.data.token });
      }
    },
  }),
})
export default login
