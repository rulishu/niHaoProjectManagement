import { createModel } from '@rematch/core'
import {
  editTaskMilestone, // 更改任务里程碑
  // convertToTask, // 转换为任务
  editTaskAssign, // 更改任务指派人
  editTaskCloseTime, // 更改任务关闭时间
  editTaskLabel, // 更改任务标签
  // countAssignment, // 任务状态统计
  // delBatchTake, // 批量删除
  // addTaskList, // 任务列表新增
  // editTaskList, // 任务列表编辑
  // getProjectOverviewTask, // 项目概览：任务列表
  // getTaskDetailsData, // 任务列表详情查询
  getTaskDetailsDataUnCheck, // 任务列表详情查询
  // getTaskPagingData, // 任务列表分页查询
} from '../servers/projectTasks'
// import { Notify } from 'uiw'

/* 任务Project*/
export default createModel()({
  name: 'projectTasks',
  state: {
    page: 1,
    pageSize: 10,
    editTaskData: {
      labels: [], // 标签
      milestones: {
        // 里程碑
        milestonesId: 0,
        milestonesTitle: '',
      },
      assigneeUser: {
        // 指派人
        assigneeUserId: 0,
        assigneeUserName: '',
      },
      dueDate: '', // 截止时间
    },
    taskInfoData: {},
  },
  effects: (dispatch) => {
    return {
      // 任务列表详情查询
      async getTaskDetailsDataUnCheck(payload, { projectTasks }) {
        const data = await getTaskDetailsDataUnCheck(payload)
        if (data && data.code === 200) {
          dispatch({
            type: 'projectTasks/update',
            payload: {
              taskInfoData: data.data,
              editTaskData: {
                labels: data.data?.labels,
                milestones: {
                  milestonesId: data.data?.milestonesId,
                  milestonesTitle: data.data?.milestonesTitle,
                },
                assigneeUser: {
                  assigneeUserId: data.data?.assigneeUserId,
                  assigneeUserName: data.data?.assigneeUserName,
                },
                dueDate: data.data?.labels,
              },
            },
          })
        }
      },
      // 更改任务里程碑
      async editTaskMilestone(payload, { projectTasks }) {
        const { param, callback } = payload
        const { milestones } = projectTasks
        const data = await editTaskMilestone({ ...milestones, ...param })
        if (data && data.code === 200) callback && callback()
      },
      // 更改任务指派人
      async editTaskAssign(payload, { projectTasks }) {
        const { param, callback } = payload
        const { assigneeUser } = projectTasks
        const data = await editTaskAssign({ ...assigneeUser, ...param })
        if (data && data.code === 200) callback && callback()
      },
      // 更改任务关闭时间
      async editTaskCloseTime(payload, { projectTasks }) {
        const { param, callback } = payload
        const { dueDate } = projectTasks
        const data = await editTaskCloseTime({ dueDate, ...param })
        if (data && data.code === 200) callback && callback()
      },
      // 更改任务标签
      async editTaskLabel(payload, { projectTasks }) {
        const { param, callback } = payload
        const { labels } = projectTasks
        const data = await editTaskLabel({ ...labels, ...param })
        if (data && data.code === 200) callback && callback()
      },
    }
  },
  reducers: {
    update: (state, payload) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
})
