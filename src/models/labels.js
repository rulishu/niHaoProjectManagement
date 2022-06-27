import { createModel } from '@rematch/core'
import {
  getAllLabelData,
  deleteLabel,
  addLabelItem,
  getLabelInfoById,
  // getAllLabelPageData,
  editLabelInfo,
} from '../servers/labels'
import { Notify } from 'uiw'

const labels = createModel()({
  name: 'labels',
  state: {
    listData: [],
    labelInfo: {},
    sorting: {
      orderByColumn: 'createTime', // 排序列名 name：名称 createTime：创建时间  updateTime：更新时间
      isAsc: 'asc', // 排序方式  desc降序  asc 升序
    },
    name: '', // 查询标签名
    linkId: 0, // 关联ID
    idType: 1, // ID类型 1：组织 2：项目
    type: 1, // type 操作状态 1：新增， 2：编辑
    projectId: 0,
  },
  effects: (dispatch) => ({
    // 标签：条件查询-不分页
    async getAllLabelData(payload, { labels }) {
      const data = await getAllLabelData({ ...payload, ...labels?.sorting })
      if (data && data.code === 200) {
        dispatch({
          type: 'labels/updateState',
          payload: { listData: data.data },
        })
      }
    },

    // 新增
    async addLabelItem(payload, { labels }) {
      const { param, callback } = payload
      const data = await addLabelItem(param)
      if (data && data.code === 200) {
        callback && callback(data && data.code === 200)
        Notify.success({ description: '新增成功' })
      }
    },

    // 删除
    async deleteLabel(payload, { labels }) {
      const { projectId } = labels
      const data = await deleteLabel(payload)
      if (data && data.code === 200) {
        Notify.success({ description: '删除成功' })
        await dispatch({
          type: 'labels/getAllLabelData',
          payload: { projectId },
        })
      }
    },

    // 根据ID查详情
    async getLabelInfoById(payload, { labels }) {
      const data = await getLabelInfoById(payload)
      if (data && data.code === 200) {
        dispatch({
          type: 'labels/updateState',
          payload: { labelInfo: data.data },
        })
      }
    },

    // 编辑
    async editLabelInfo(payload, { labels }) {
      const { param, callback } = payload
      const data = await editLabelInfo(param)
      if (data && data.code === 200) {
        Notify.success({ description: '修改成功' })
        callback && callback()
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
export default labels
