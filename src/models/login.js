import { history } from '@uiw-admin/router-control'
import { createModel } from '@rematch/core'
import {
  getThirdLoginToken,
  authorAndLogin,
  register,
  getRegisterSwitch,
} from '../servers/login'
import { Notify } from 'uiw'

const login = createModel()({
  name: 'login',
  state: {
    userData: null,
    token: null,
    isLogin: true,
    isRegister: false,
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

    //注册新用户
    async register(param) {
      const data = await register(param)
      if (data && data.code === 200) {
        Notify.success({
          title: '成功通知',
          description: data?.message + '请登录!',
        })
        dispatch.login.updateState({
          isLogin: true,
        })
      }
    },

    //注册功能开启设置
    async getRegisterSwitch() {
      const data = await getRegisterSwitch()
      if (data && data.code === 200) {
        dispatch.login.updateState({
          isRegister: data.data,
        })
      }
    },
  }),
})
export default login
