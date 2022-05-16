module.exports.allusersqueryByPage = function (req, res) {
  return res.status(200).json({
    success: true,
    code: 200,
    message: '成功',
    data: {
      total: 17,
      list: [
        {
          id: 72,
          uuid: '9ca509d948d34d7e813682526fb9f98e',
          path: 'http://192.168.188.222:33680/nihao-service/9ca509d948d34d7e813682526fb9f98e',
          userName: '赵非凡',
          sex: 0,
          userPhone: '13988882309',
          userEmail: '1221@qq.com',
          userPosition: '04',
          userAccount: 'zhaofeifan',
          userPassword: '123456789',
          createTime: '2022-05-16 11:45:04',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 4,
        },
        {
          id: 121,
          uuid: '73d0b50d834441769dd7045884d4325f',
          path: 'http://192.168.188.222:33680/nihao-service/73d0b50d834441769dd7045884d4325f',
          userName: '洪高锋',
          sex: 1,
          userPhone: '',
          userEmail: '',
          userPosition: '03',
          userAccount: 'honggaofeng',
          userPassword: '123456',
          createTime: '2022-05-13 15:45:00',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 1,
        },
        {
          id: 120,
          uuid: '471e5e275121464e9aaecb12050ce7d2',
          path: 'http://192.168.188.222:33680/nihao-service/471e5e275121464e9aaecb12050ce7d2',
          userName: '沈建澄',
          sex: 1,
          userPhone: '',
          userEmail: '',
          userPosition: '03',
          userAccount: 'shenjiancheng',
          userPassword: '123456',
          createTime: '2022-05-13 15:44:15',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 1,
        },
        {
          id: 119,
          uuid: null,
          path: null,
          userName: 'cc',
          sex: null,
          userPhone: null,
          userEmail: null,
          userPosition: null,
          userAccount: 'cc',
          userPassword: '123456',
          createTime: '2022-05-11 23:43:17',
          roleId: 2,
          isGuide: null,
          roleName: '管理员',
          porNum: 0,
        },
        {
          id: 47,
          uuid: '8e4a836c855849fbac96af477e5c5797',
          path: 'http://192.168.188.222:33680/nihao-service/8e4a836c855849fbac96af477e5c5797',
          userName: '殷士豪',
          sex: 0,
          userPhone: '18476776483',
          userEmail: '18476776483@qq.com',
          userPosition: '04',
          userAccount: 'yinshihao',
          userPassword: '123456',
          createTime: '2022-05-10 16:26:13',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 1,
        },
        {
          id: 68,
          uuid: 'b2ed13104bf7451c9e16a2fcced96da8',
          path: 'http://192.168.188.222:33680/nihao-service/b2ed13104bf7451c9e16a2fcced96da8',
          userName: '王乐',
          sex: 0,
          userPhone: '',
          userEmail: '',
          userPosition: '03',
          userAccount: 'wangle',
          userPassword: '123456',
          createTime: '2022-05-10 16:26:09',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 6,
        },
        {
          id: 75,
          uuid: '664fe62ec8324f0e85c14d156e15025a',
          path: 'http://192.168.188.222:33680/nihao-service/664fe62ec8324f0e85c14d156e15025a',
          userName: '王龙飞',
          sex: 0,
          userPhone: '',
          userEmail: '',
          userPosition: '04',
          userAccount: 'wanglongfei',
          userPassword: '123456',
          createTime: '2022-05-09 10:49:00',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 5,
        },
        {
          id: 115,
          uuid: '518c0bc2a28f496595f2be7bab20d7af',
          path: 'http://192.168.188.222:33680/nihao-service/518c0bc2a28f496595f2be7bab20d7af',
          userName: 'xingyuefeng1',
          sex: null,
          userPhone: '',
          userEmail: '',
          userPosition: '02',
          userAccount: '111',
          userPassword: '1234561',
          createTime: '2022-05-09 09:56:23',
          roleId: 2,
          isGuide: null,
          roleName: '管理员',
          porNum: 1,
        },
        {
          id: 77,
          uuid: '61b05579885d433f9e925712d768e319',
          path: 'http://192.168.188.222:33680/nihao-service/61b05579885d433f9e925712d768e319',
          userName: '安江峰',
          sex: 0,
          userPhone: '',
          userEmail: '',
          userPosition: '04',
          userAccount: 'anjiangfeng',
          userPassword: '123456',
          createTime: '2022-05-07 15:22:21',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 3,
        },
        {
          id: 109,
          uuid: '94246831fe52440a8012b7433f23132b',
          path: 'http://192.168.188.222:33680/nihao-service/94246831fe52440a8012b7433f23132b',
          userName: '陈骏',
          sex: 0,
          userPhone: '13916309195',
          userEmail: '38469540@163.com',
          userPosition: '02',
          userAccount: 'chenjun',
          userPassword: '123456',
          createTime: '2022-04-25 09:55:22',
          roleId: 3,
          isGuide: null,
          roleName: '开发者',
          porNum: 3,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      size: 10,
      startRow: 1,
      endRow: 10,
      pages: 2,
      prePage: 0,
      nextPage: 2,
      isFirstPage: true,
      isLastPage: false,
      hasPreviousPage: false,
      hasNextPage: true,
      navigatePages: 8,
      navigatepageNums: [1, 2],
      navigateFirstPage: 1,
      navigateLastPage: 2,
    },
  })
}
