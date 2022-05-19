import path from 'path'
import defaultConfig from '@uiw-admin/config'
import { createProxyMiddleware } from 'http-proxy-middleware'
export default defaultConfig({
  define: {
    AUTH: false,
    STORAGE: 'local', // TOKEN_STORAGE: "cookie",
    // TOKEN_NAME: "存储字段"
    SEARCH_MENU: false,
  },
  // rematch: {
  //   lazyLoad: true,
  // },
  // 第一种
  proxySetup: (app) => {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://192.168.188.222:33202', // 测试环境地址
        // target: 'http://52s37919h6.zicp.vip:54132/',
        changeOrigin: true,
        // headers: {Authorization: 'Bearer ' + token},
      })
    )
    return {
      path: path.resolve('./mocker/index.js'),
    }
  },
}) // 第二种
