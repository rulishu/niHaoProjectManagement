import { createModel } from '@rematch/core'
import {
  getConfigControl,
  setConfigControl,

  // 第三方迁入源控制层
  // delDataByIdSource, // 根据主键删除数据
  addDataSource, // 新增数据
  getDataByIdSource, // 根据主键id查询数据
  getPagingDataSource, // 分页-条件查询列表数据
  // updateDataByIdSource, // 根据主键id更新数据
  // 第三方迁移明细控制层
  // getDataByIdDetail, // 根据主键id查询数据
  getPagingDataDetail, // 分页-条件查询列表数据
} from '../servers/migrate'
import { Notify } from 'uiw'

const thirdpartyMigration = createModel()({
  name: 'migrate',
  state: {
    loginConfig: {},
    source: {
      page: 1,
      pageSize: 10,
      listData: [], // 列数据
      dataInfo: {}, // 当前对象
    },
    detail: {
      page: 1,
      pageSize: 10,
      listData: [], // 列数据
    },
  },
  effects: (dispatch) => ({
    // 标签：条件查询-不分页
    async getConfigControl(payload, { migrate }) {
      const data = await getConfigControl({ ...payload })
      if (data && data.code === 200) {
        dispatch({
          type: 'migrate/updateState',
          payload: { loginConfig: data.data },
        })
      }
    },
    async setConfigControl(payload, { migrate }) {
      const { loginConfig } = migrate
      await setConfigControl({ ...loginConfig, ...payload })
    },
    /**
     * 第三方迁入源控制层
     */
    // 分页-条件查询列表数据
    async getPagingDataSource(payload, { migrate: { source } }) {
      const data = await getPagingDataSource({ ...payload })
      if (data && data.code === 200) {
        dispatch({
          type: 'migrate/updateState',
          payload: { source: { ...source, listData: data.data.rows } },
        })
      }
    },
    // 新增数据
    async addDataSource(payload, { migrate }) {
      const data = await addDataSource({ ...payload })
      if (data && data.code === 200) {
        Notify.success({ description: '新增成功' })
      }
    },
    // 根据主键id查询数据
    async getDataByIdSource(payload, { migrate: { source } }) {
      const data = await getDataByIdSource(payload)
      if (data && data.code === 200) {
        dispatch({
          type: 'migrate/updateState',
          payload: { source: { ...source, dataInfo: data?.data } },
        })
      }
    },

    /**
     * 第三方迁移明细控制层
     */
    // 分页-条件查询列表数据
    async getPagingDataDetail(payload, { migrate: { detail } }) {
      const data = await getPagingDataDetail({ ...payload })
      if (data && data.code === 200) {
        dispatch({
          type: 'migrate/updateState',
          payload: { detail: { ...detail, listData: data.data.rows } },
        })
      }
    },
  }),
  reducers: {
    updateState: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
})
export default thirdpartyMigration
