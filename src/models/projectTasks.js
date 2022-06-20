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
  // getTaskDetailsDataUnCheck, // 任务列表详情查询
  // getTaskPagingData, // 任务列表分页查询
} from '../servers/projectTasks'
// import { Notify } from 'uiw'

/* 任务Project*/
export default createModel()({
  name: 'projectTasks',
  state: {
    page: 1,
    pageSize: 10,
    EditTasksData: {},
  },
  effects: (dispatch) => {
    return {
      // 更改任务里程碑
      async editTaskMilestone(payload, { projectTasks }) {
        await editTaskMilestone(payload)
      },
      // 更改任务指派人
      async editTaskAssign(payload, { projectTasks }) {
        await editTaskAssign(payload)
      },
      // 更改任务关闭时间
      async editTaskCloseTime(payload, { projectTasks }) {
        await editTaskCloseTime(payload)
      },
      // 更改任务指派人
      async editTaskLabel(payload, { projectTasks }) {
        await editTaskLabel(payload)
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
