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
  editTaskList, // 任务列表编辑
  // getProjectOverviewTask, // 项目概览：任务列表
  // getTaskDetailsData, // 任务列表详情查询
  getTaskDetailsDataUnCheck, // 任务列表详情查询
  // getTaskPagingData, // 任务列表分页查询
  /* 评论 */
  addTaskComment, // 添加评论
  editTaskComment, // 编辑评论
  delTaskComment, // 删除评论
  /* 代办 */
  addMyToDo,
  getStrutsSwitch,
} from '../servers/projectTasks'
// import { Notify } from 'uiw'

/* 任务Project*/
export default createModel()({
  name: 'projectTasks',
  state: {
    page: 1,
    pageSize: 10,
    issueType: 'cancel',
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
    editTaskFromData: {
      assignmentId: 0, // 任务名称
      assignmentTitle: '', // 任务标题
      description: '', // 任务描述
    },
    loginUserTodoIdList: [], // 当前登录用户的代办列表
    taskInfoData: {},
    commentData: { operatingRecords: '' }, // 评论
    replyConData: { operatingRecords: '' }, // 回复评论
    editCommentData: { operatingRecords: '' }, // 编辑评论
    replyState: false, // 回复状态
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
              editTaskFromData: {
                assignmentId: data.data?.assignmentId,
                assignmentTitle: data.data?.assignmentTitle,
                description: data.data?.description,
              },
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

      // 任务列表编辑
      async editTaskList(params, { projectTasks }) {
        const { editTaskFromData, taskInfoData } = projectTasks
        const { projectId, assignmentId } = taskInfoData
        const { getTaskDetailsDataUnCheck, update } = dispatch.projectTasks
        const newTaskInfoData = { ...taskInfoData, ...editTaskFromData }
        if (JSON.stringify(taskInfoData) === JSON.stringify(newTaskInfoData))
          return false
        const data = await editTaskList({
          ...editTaskFromData,
          ...params,
        })
        getTaskDetailsDataUnCheck({ projectId, id: assignmentId })
        if (data && data.code === 200) {
          update({ issueType: 'cancel' })
          return true
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

      // 添加评论
      async addTaskComment(payload, { projectTasks }) {
        const { projectId, assignmentId } = projectTasks.taskInfoData
        const { getTaskDetailsDataUnCheck, update } = dispatch.projectTasks
        const { params, callback } = payload
        const data = await addTaskComment({ type: 2, projectId, ...params })
        if (data && data.code === 200) {
          getTaskDetailsDataUnCheck({ projectId, id: assignmentId })
          update({
            commentData: { operatingRecords: '' },
            replyState: false,
          })
          callback && callback()
        }
      },

      // 编辑评论
      async editTaskComment(payload, { projectTasks }) {
        const { projectId, assignmentId } = projectTasks.taskInfoData
        const { getTaskDetailsDataUnCheck, update } = dispatch.projectTasks
        const { params, callback } = payload
        const data = await editTaskComment({ projectId, ...params })
        if (data && data.code === 200) {
          getTaskDetailsDataUnCheck({ projectId, id: assignmentId })
          update({
            commentData: { operatingRecords: '' },
            editState: false,
            replyConState: false,
          })
          callback && callback()
        }
      },

      // 删除评论
      async delTaskComment(params, { projectTasks }) {
        const { assignmentId, projectId, taskHistoryId } = params
        const { getTaskDetailsDataUnCheck, update } = dispatch.projectTasks
        const data = await delTaskComment({
          projectId,
          id: taskHistoryId,
        })
        if (data && data.code === 200) {
          getTaskDetailsDataUnCheck({ projectId, id: assignmentId })
          update({ commentData: { operatingRecords: '' } })
        }
      },

      // 添加任务至我的待办
      async addMyToDo(payload, { projectTasks }) {
        const { projectId, assignmentId } = projectTasks.taskInfoData
        const { param, callback } = payload
        const data = await addMyToDo({ projectId, id: assignmentId, ...param })
        if (data && data.code === 200) {
          dispatch.projectTasks.getTaskDetailsDataUnCheck({
            projectId,
            id: assignmentId,
          })
          callback && callback()
        }
      },

      // 标记已完成
      async getStrutsSwitch(payload, { projectTasks }) {
        const { loginUserTodoIdList } = projectTasks
        const { projectId, assignmentId } = projectTasks.taskInfoData
        const { param, callback } = payload
        const data = await getStrutsSwitch(
          param?.length ? param : loginUserTodoIdList
        )
        if (data && data.code === 200) {
          dispatch.projectTasks.getTaskDetailsDataUnCheck({
            projectId,
            id: assignmentId,
          })
          callback && callback()
        }
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
