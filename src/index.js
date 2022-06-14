import ReactDOM from 'react-dom'
import Control, { navigate } from '@uiw-admin/router-control'
import { SWRConfig } from 'swr'
import { request } from '@uiw-admin/utils'
import '@uiw/reset.css'
import './index.css'
import axios from 'axios'
import { Notify } from 'uiw'
import newDebounce from '@/utils/debounce'

// 添加响应拦截器
axios.interceptors.response.use(
  async (response) => {
    if (response?.data?.code === 401) {
      localStorage.removeItem('token')
      navigate('/login')
    }
    if (response?.data?.code !== 200 && response?.data?.code !== 401) {
      // 判断是否为 Blob 数据
      if (!(response?.data instanceof Blob)) {
        await newDebounce(Notify.error, 300, {
          title: '响应失败',
          description: response?.data?.message,
          duration: 3,
        })
      }
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

ReactDOM.render(
  <SWRConfig
    value={{
      fetcher: (resource, init) => {
        return request(resource, init)
      },
      provider: () => new Map(),
    }}>
    <Control
      routeType="hash" // isAutoAuth={false}
      notLoginMenus={['/dom', '/dom/courses']} // navigateTo="/404"
      // addModels={(path) => import(`${path}`)}
    />
  </SWRConfig>,
  document.getElementById('root')
)
