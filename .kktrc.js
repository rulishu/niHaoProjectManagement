import path from 'path'
import defaultConfig from '@uiw-admin/config'
export default defaultConfig({
  define: {
    // AUTH: false,
    STORAGE: 'local', // TOKEN_STORAGE: "cookie",
    // TOKEN_NAME: "存储字段"
    SEARCH_MENU: false,
  },
  // rematch: {
  //   lazyLoad: true,
  // },
  // 第一种
  proxySetup: (app) => {
    return {
      path: path.resolve('./mocker/index.js'),
    }
  },
}) // 第二种
