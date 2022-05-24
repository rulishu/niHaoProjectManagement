import { createModel } from '@rematch/core'
import {
  queryPaging,
  addMilestones,
  getMilestonesInfo,
  deleteMilestones,
  updateMilestones,
  editStatusMilestones,
  getSelectAll,
  getAllLabel,
} from '@/servers/milestone'
import { Notify } from 'uiw'

const NotifySuccess = (message) => {
  return Notify.success({ title: message, description: '' })
}
/**
 * 里程碑 milestone
 */
export default createModel()({
  name: 'milestone',
  state: {
    filter: {
      page: 1,
      pageSize: 10,
    },
    fromData: {
      milestonesId: 0,
    },
    taskMilestonesId: '',
    taskMilestonesTitle: '',
    milestoneType: 0,
    milestonesId: 0,
    projectId: 0,
    listData: [],
    openListData: [],
    openListTotal: 0,
    closeListData: [],
    closeListTotal: 0,
    listDataInfo: {},
    milepostaData: [],
    allLabelData: [], // 所有标签数据
    total: 0,
    activeKey: '1',
  },
  effects: (dispatch) => {
    return {
      // 分页查询里程碑
      async selectPageList(payload, { milestone }) {
        const {
          filter: { pageSize, page },
        } = milestone
        const params = {
          pageSize,
          page,
          order: 1,
          projectId: Number(sessionStorage.getItem('id')),
          ...payload,
        }
        const data = await queryPaging(params)
        if (data.code === 200) {
          const newData = {}
          if (
            payload?.milestonesStatusList?.length === 1 &&
            +payload.milestonesStatusList[0] === 1
          ) {
            newData.openListData = data?.data.rows
            newData.openListTotal = data?.data.total
          }
          if (
            payload?.milestonesStatusList?.length === 1 &&
            +payload.milestonesStatusList[0] === 2
          ) {
            newData.closeListData = data?.data.rows
            newData.closeListTotal = data?.data.total
          }
          if (payload?.milestonesStatusList?.length !== 1) {
            newData.listData = data?.data.rows
            newData.total = data?.data.total
          }
          dispatch.milestone.update({ ...newData })
        }
      },
      // 所有里程碑查询
      async getListAll(payload, { milestone }) {
        const params = {
          projectId: Number(sessionStorage.getItem('id')),
          ...payload,
        }
        const data = await getSelectAll(params)
        if (data.code === 200) {
          dispatch.milestone.update({
            milepostaData: data?.data || [],
          })
        }
      },
      // 新增里程碑
      async addMilestone({ payload, callback }, { milestone }) {
        const { projectId } = milestone
        const params = { projectId, ...payload }
        const data = await addMilestones(params)
        if (data.code === 200) {
          NotifySuccess(data.message)
          callback && callback(data.data.projectId, data.data.milestonesId)
        }
      },
      // 根据id查询里程碑详情
      async getMilestone(payload, { milestone }) {
        const { projectId, milestonesId } = payload
        const data = await getMilestonesInfo({
          id: milestonesId,
          projectId,
        })
        if (data.code === 200) {
          dispatch.milestone.update({
            listDataInfo: data?.data || milestone.listDataInfo,
          })
        }
      },
      // 删除里程碑
      async delMilestones({ payload, callback }, { milestone }) {
        const data = await deleteMilestones({
          id: payload,
          projectId: milestone.projectId,
        })
        if (data.code === 200) {
          NotifySuccess(data.message)
          callback && callback()
        }
      },
      // 编辑里程碑
      async editMilestone({ payload, callback }, { milestone }) {
        const { milestonesId, projectId } = milestone
        const params = { milestonesId, projectId, ...payload }
        const data = await updateMilestones(params)
        if (data.code === 200) {
          NotifySuccess(data.message)
          callback && callback()
        }
      },
      // 编辑里程碑状态
      async editStatusMilestones(payload, { milestone }) {
        const data = await editStatusMilestones(payload)
        if (data.code === 200) {
          NotifySuccess(data.message)
        }
      },
      // 根据id查询里程碑详情
      async getAllLabel(payload, { milestone }) {
        const data = await getAllLabel(payload)
        if (data.code === 200) {
          dispatch.milestone.update({
            allLabelData: data?.data,
          })
        }
      },
    }
  },
  reducers: {
    update: (state, payload) => {
      return { ...state, ...payload }
    },
  },
})
