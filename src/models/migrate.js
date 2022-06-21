import { createModel } from '@rematch/core'
import {
  getConfigControl,
  setConfigControl,
  synchronizationControl, // gitlab数据同步
  getDataByIdControl, // 根据主键id查询数据
  migrateLabelsDataById, // 根据主键id迁移标签（Labels）数据
  migrateIssuesDataById, // 根据主键id迁移issue数据
  migrateMilestoneDataById,
  migrateProjectDataById,
  // 第三方迁入源控制层
  delDataByIdSource, // 根据主键删除数据
  addDataSource, // 新增数据
  getDataByIdSource, // 根据主键id查询数据
  getPagingDataSource, // 分页-条件查询列表数据
  updateDataByIdSource, // 根据主键id更新数据
  // 第三方迁移明细控制层
  getDataByIdDetail, // 根据主键id查询数据
  getPagingDataDetail, // 分页-条件查询列表数据
} from '../servers/migrate'
import { Notify } from 'uiw'

const thirdpartyMigration = createModel()({
  name: 'migrate',
  state: {
    isOpen: false, //删除弹窗
    ids: '', //存储删除id
    loginConfig: {},
    control: {
      dataInfo: {},
      type: 2, // 2：编辑 3： 查看
    },
    source: {
      page: 1,
      pageSize: 10,
      listData: [], // 列数据
      dataInfo: {}, // 当前对象
      type: 1, // 1：新增 2：编辑 3： 查看
    },
    detail: {
      page: 1,
      pageSize: 10,
      listData: [], // 列数据
      dataInfo: {}, // 当前对象
    },
    sourceState: false,
    confignState: false,
  },
  effects: (dispatch) => ({
    // 标签：条件查询-不分页
    async getConfigControl(payload, { migrate }) {
      dispatch({
        type: 'migrate/updateState',
        payload: { loginConfig: {} },
      })
      const data = await getConfigControl({ ...payload })
      if (data && data.code === 200) {
        dispatch({
          type: 'migrate/updateState',
          payload: { loginConfig: data.data },
        })
      }
    },
    async setConfigControl(payload, { migrate }) {
      dispatch({
        type: 'migrate/updateState',
        payload: { confignState: true },
      })
      const { param, callback } = payload
      const { loginConfig } = migrate
      const data = await setConfigControl({ ...loginConfig, ...param })
      if (data && data.code === 200) {
        callback && callback()
        Notify.success({ description: '配置成功' })
        dispatch({
          type: 'migrate/updateState',
          payload: { loginConfig: {}, confignState: false },
        })
      } else {
        dispatch({
          type: 'migrate/updateState',
          payload: { confignState: false },
        })
      }
    },
    // gitlab数据同步
    async synchronizationControl(payload, { migrate: { control } }) {
      const { param, callback } = payload
      const data = await synchronizationControl(param)
      if (data && data.code === 200) {
        callback && callback()
      }
    },
    // 根据主键id查询数据
    async getDataByIdControl(payload, { migrate: { control } }) {
      const data = await getDataByIdControl(payload)
      if (data && data.code === 200) {
        dispatch({
          type: 'migrate/updateState',
          payload: { control: { ...control, dataInfo: data?.data } },
        })
      }
    },

    // 根据主键id迁移里程碑数据
    async migrateMilestoneDataById(payload, { migrate: { control } }) {
      const data = await migrateMilestoneDataById(payload)
      if (data && data.code === 200) {
        Notify.success({ description: '同步里程碑数据成功' })
      }
    },

    // 根据主键id迁移标签（Labels）数据
    async migrateLabelsDataById(payload, { migrate: { control } }) {
      const data = await migrateLabelsDataById(payload)
      if (data && data.code === 200) {
        Notify.success({ description: '同步标签数据成功' })
      }
    },

    // 根据主键id迁移issue数据
    async migrateIssuesDataById(payload, { migrate: { control } }) {
      const data = await migrateIssuesDataById(payload)
      if (data && data.code === 200) {
        Notify.success({ description: '同步Issues数据成功' })
      }
    },

    // 同步项目数据
    async migrateProjectDataById(payload, { migrate: { control } }) {
      const data = await migrateProjectDataById(payload)
      if (data && data.code === 200) {
        Notify.success({ description: '同步项目数据成功' })
      }
    },

    /**
     * 第三方迁入源控制层
     */

    // 根据主键删除数据
    async delDataByIdSource(payload, { migrate: { source } }) {
      const data = await delDataByIdSource([payload])
      if (data && data.code === 200) {
        Notify.success({ description: '已删除' })
      }
    },
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
      dispatch.migrate.updateState({
        sourceState: true,
      })
      const { param, callback } = payload
      const data = await addDataSource({ ...param })
      if (data && data.code === 200) {
        dispatch.migrate.updateState({
          sourceState: false,
        })
        callback && callback()
        Notify.success({ description: '新增成功' })
      } else {
        dispatch.migrate.updateState({
          sourceState: false,
        })
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
    // 根据主键id更新数据
    async updateDataByIdSource(payload, { migrate: { source } }) {
      dispatch.migrate.updateState({
        sourceState: true,
      })
      const { param, callback } = payload
      const data = await updateDataByIdSource(param)
      if (data && data.code === 200) {
        dispatch.migrate.updateState({
          sourceState: false,
        })
        callback && callback()
        Notify.success({ description: '更新成功' })
      } else {
        dispatch.migrate.updateState({
          sourceState: false,
        })
      }
    },

    /**
     * 第三方迁移明细控制层
     */
    // 根据主键id查询数据
    async getDataByIdDetail(payload, { migrate: { detail } }) {
      const data = await getDataByIdDetail(payload)
      if (data && data.code === 200) {
        dispatch({
          type: 'migrate/updateState',
          payload: { detail: { ...detail, dataInfo: data?.data } },
        })
      }
    },
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
