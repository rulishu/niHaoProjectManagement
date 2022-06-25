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
        // target: 'http://192.168.188.215:7500/', // 邓伟伟
        // target: 'http://192.168.188.81:7500/', // 曾王杰
        // target: 'http://192.168.188.199:7500/', // 王龙飞
        // target: 'https://dtpms-dev.nihaosi.com/', //  测试环境
        changeOrigin: true,
        // headers: {Authorization: 'Bearer ' + token},
      })
    )
    return {
      path: path.resolve('./mocker/index.js'),
    }
  },
}) // 第二种
