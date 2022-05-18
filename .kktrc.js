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
        target: 'http://47.111.0.26:31656/', // 测试环境地址
        changeOrigin: true,
        // headers: {Authorization: 'Bearer ' + token},
      })
    )
    return {
      path: path.resolve('./mocker/index.js'),
    }
  },
}) // 第二种
