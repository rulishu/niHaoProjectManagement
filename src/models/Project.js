import { createModel } from '@rematch/core'
import {
  getSelectPage,
  getManagerAssignmentUpdate,
  getManagerAssignmentSelectById,
  getmMnagerAssignmentSave,
  deleteAssignment,
  // getAssignmentHistorySave,
  // getAssignmentHistoryDel,
  // getAssignmentHistoryEdit,
  queryFuzzyAllProjectMember,
  selectLabel,
  assignment_label,
  countAssignment,
  getAssignment, //不分页获取所有任务
  // addMyToDo,
  // getStrutsSwitch,
} from '../servers/project'
import { getProjectCountById } from '../servers/projectoverview'
import { Notify } from 'uiw'

const NotifySuccess = (message) => {
  return Notify.success({ title: message, description: '' })
}

const userData = JSON.parse(localStorage.getItem('userData'))
/* 任务Project*/
export default createModel()({
  name: 'project',
  state: {
    filter: {
      page: 1,
      pageSize: 10,
    },
    dataList: [],
    prepareList: [],
    prepareTotal: 0,
    openTataList: [],
    openTotal: 0,
    closeDataList: [],
    closeTotal: 0,
    issueType: 'cancel',
    isView: false,
    queryInfo: {},
    taskInfoData: {},
    activeKey: '2',
    fromData: {
      createId: userData?.id,
      createName: userData?.userName,
      assignmentTitle: '',
      assigneeUserId: 0,
      assignmentType: 1,
      description: '',
      projectId: '',
      labels: [],
    },
    editFromData: {
      assignmentTitle: '',
      description: '',
      commentDescription: '',
      milestonesId: 0,
      labels: [],
      fileId: [],
    },
    editCommentData: {},
    editState: false,
    replyCommentData: {},
    replyState: false,
    replyConData: {},
    replyConState: false,
    commentData: {
      operatingRecords: '',
    },
    teamMembers: [],
    assignmentLabels: [],
    milistones: [],
    splicingConditionsDtos: [],
    selectDtos: [], // 上方搜索条件
    tabDtos: [], // tab搜索条件
    taskNum: '', //任务各状态总数
    allWork: [], //所有任务，不分页
    handleState: false,
  },
  effects: (dispatch) => {
    return {
      // 查询项目统计
      async getProjectCountById(payload) {
        const data = await getProjectCountById(payload)
        if (data.code === 200) {
          dispatch.project.update({
            prepareTotal: data.data?.totalWorkVo?.projectWksNum || 0,
            openTotal: data.data?.totalWorkVo?.projectKfzNum || 0,
            closeTotal: data.data?.totalWorkVo?.projectYwcNum || 0,
            overtimeTotal: data.data?.totalWorkVo?.projectYqsNum || 0,
            total: data.data?.totalWorkVo?.projectNum || 0,
          })
        } else {
          Notify.error({ description: data?.message })
        }
      },
      // 分页查询
      async getList(params, { project }) {
        const { assignmentStatus, ...others } = params
        const { filter, selectDtos } = project //tabDtos
        let newArr = () => {
          let createIddata = selectDtos.filter(function (item) {
            return item.field === 'createId'
          })
          let createIds = []
          createIddata?.map((item, index) => createIds.push(item.value))

          let assignmentIddata = selectDtos.filter(function (item) {
            return item.field === 'assignmentId'
          })
          let assignmentIds = []
          assignmentIddata?.map((item, index) => assignmentIds.push(item.value))

          let milestonesIddata = selectDtos.filter(function (item) {
            return item.field === 'milestonesId'
          })
          let milestonesIds = []
          milestonesIddata?.map((item, index) => milestonesIds.push(item.value))
          let labelsdata = selectDtos.filter(function (item) {
            return item.field === 'labels'
          })
          let labels = []
          labelsdata?.map((item, index) => labels.push(item.value))
          return {
            createId: createIds || [],
            assignmentUserId: assignmentIds || [],
            milestonesId: milestonesIds || [],
            labels: labels || [],
          }
        }
        let arr = newArr()
        let newObj = {
          ...filter,
          assignmentStatus: params?.assignmentStatus,
          ...others,
          ...arr,
        }
        const data = await getSelectPage(newObj)
        if (data && data.code === 200) {
          if (assignmentStatus === '1') {
            dispatch.project.update({
              prepareList: data?.data.rows || [],
              prepareTotal: data?.data.total,
            })
          } else if (assignmentStatus === '2') {
            dispatch.project.update({
              openTataList: data?.data.rows || [],
              openTotal: data?.data.total,
            })
          } else if (assignmentStatus === '3') {
            dispatch.project.update({
              closeDataList: data?.data.rows || [],
              closeTotal: data?.data.total,
            })
          } else if (assignmentStatus === '4') {
            dispatch.project.update({
              overtimeList: data?.data.rows || [],
              overtimeTotal: data?.data.total,
            })
          } else {
            dispatch.project.update({
              dataList: data?.data.rows || [],
              total: data?.data.total,
            })
          }
        }
      },
      // 翻页
      async goToPage(payload) {
        const { page, pageSize, assignmentStatus, projectId } = payload
        dispatch.project.update({
          filter: { page, pageSize },
        })
        await dispatch.project.getList({
          page,
          pageSize,
          assignmentStatus,
          projectId,
        })
      },
      // 不分页获取所有任务
      async getAssignment(params) {
        const data = await getAssignment(params)
        if (data && data.code === 200) {
          dispatch.project.update({ allWork: data.data })
        }
      },
      // 查询成员
      async queryFuzzyAllProjectMember(params) {
        const data = await queryFuzzyAllProjectMember({
          ...params,
        })
        if (data && data.code === 200) {
          if (data.data && data.data.length > 0) {
            const teamMembers = data.data.map((item) => ({
              label: item.memberName,
              value: item.userId,
            }))
            dispatch.project.update({ teamMembers })
          }
        }
      },
      // 查询所有里程碑
      async selectLabel(params) {
        const data = await selectLabel({
          ...params,
        })
        if (data && data.code === 200) {
          if (data.data && data.data.length > 0) {
            const milistones = data.data.map((item) => ({
              label: item.milestonesTitle,
              value: item.milestonesId,
            }))
            dispatch.project.update({ milistones })
          }
        }
      },
      //查询所有标签
      async assignment_label(params) {
        const data = await assignment_label({
          ...params,
        })
        if (data && data.code === 200) {
          if (data.data && data.data.length > 0) {
            const assignmentLabels = data.data.map((item) => ({
              label: item.dictLabel,
              value: item.dictValue,
            }))
            dispatch.project.update({ assignmentLabels })
          }
        }
      },
      // 任务列表新增
      async getAdd(params, { project }) {
        const { labels, ...newData } = project.fromData
        newData.labels = labels
        const data = await getmMnagerAssignmentSave({
          ...newData,
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.update({
            issueType: 'cancel',
          })
          window.history.back(-1)
          Notify.success({ title: data.message, description: '' })
        }
      },
      // 任务列表查详情
      async getSelectById(params) {
        const data = await getManagerAssignmentSelectById({
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.update({
            taskInfoData: data?.data || {},
            editFromData: data?.data || {},
            commentData: {
              type: 2,
              assignmentId: data?.data?.assignmentId,
              projectId: data?.data?.projectId,
              userId: data?.data?.userId,
              operatingRecords: '',
            },
          })
        }
      },
      // 任务列表编辑
      async getEdit(params, { project }) {
        const { editFromData, taskInfoData } = project
        if (JSON.stringify(taskInfoData) === JSON.stringify(editFromData))
          return false
        const data = await getManagerAssignmentUpdate({
          ...editFromData,
          ...params,
        })
        dispatch.project.getSelectById({
          projectId: params?.projectId || editFromData?.projectId,
          id: editFromData?.assignmentId,
        })
        if (data && data.code === 200) {
          dispatch.project.update({
            issueType: 'cancel',
          })
          NotifySuccess(data.message)
          return true
        }
      },
      // 任务列表删除
      async deleteAssignment(params) {
        const data = await deleteAssignment(params)
        return data
      },
      // // 添加评论
      // async getAddComment(payload, { project }) {
      //   const { params, callback } = payload
      //   const data = await getAssignmentHistorySave({
      //     ...project.commentData,
      //     ...params,
      //   })
      //   if (data && data.code === 200) {
      //     dispatch.project.getSelectById({
      //       projectId: project?.commentData?.projectId,
      //       id: project?.commentData?.assignmentId,
      //     })
      //     dispatch.project.queryFuzzyAllProjectMember({
      //       projectId: project?.commentData?.projectId,
      //     })
      //     dispatch.project.update({
      //       commentData: {
      //         operatingRecords: '',
      //       },
      //       replyState: false,
      //     })
      //     callback && callback()
      //   }
      // },
      // // 编辑评论
      // async getEditComment(payload, { project }) {
      //   const { params, callback } = payload
      //   const data = await getAssignmentHistoryEdit({
      //     ...project.commentData,
      //     ...params,
      //   })
      //   if (data && data.code === 200) {
      //     dispatch.project.getSelectById({
      //       projectId: project?.commentData?.projectId,
      //       id: project?.commentData?.assignmentId,
      //     })
      //     dispatch.project.queryFuzzyAllProjectMember({
      //       projectId: project?.commentData?.projectId,
      //     })
      //     dispatch.project.update({
      //       commentData: {
      //         operatingRecords: '',
      //       },
      //     })
      //     dispatch.project.update({
      //       editState: false,
      //       replyConState: false,
      //     })
      //     callback && callback()
      //   }
      // },
      // // 删除评论
      // async delCommentById(params, { project }) {
      //   const { assignmentId, projectId, taskHistoryId } = params
      //   const { getSelectById, queryFuzzyAllProjectMember, update } =
      //     dispatch.project
      //   const data = await getAssignmentHistoryDel({
      //     projectId,
      //     id: taskHistoryId,
      //   })
      //   if (data && data.code === 200) {
      //     getSelectById({ projectId, id: assignmentId })
      //     queryFuzzyAllProjectMember({ projectId })
      //     update({ commentData: { operatingRecords: '' } })
      //   }
      // },

      // 获取任务各状态总数
      async countAssignment(params, { project }) {
        const { assignmentStatus, ...others } = params
        const { filter, selectDtos } = project
        let newArr = () => {
          let createIddata = selectDtos.filter(function (item) {
            return item.field === 'createId'
          })
          let createIds = []
          createIddata?.map((item, index) => createIds.push(item.value))

          let assignmentIddata = selectDtos.filter(function (item) {
            return item.field === 'assignmentId'
          })
          let assignmentIds = []
          assignmentIddata?.map((item, index) => assignmentIds.push(item.value))

          let milestonesIddata = selectDtos.filter(function (item) {
            return item.field === 'milestonesId'
          })
          let milestonesIds = []
          milestonesIddata?.map((item, index) => milestonesIds.push(item.value))
          let labelsdata = selectDtos.filter(function (item) {
            return item.field === 'labels'
          })
          let labels = []
          labelsdata?.map((item, index) => labels.push(item.value))
          return {
            createId: createIds || [],
            assignmentUserId: assignmentIds || [],
            milestonesId: milestonesIds || [],
            labels: labels || [],
          }
        }
        let arr = newArr()
        let newObj = {
          ...filter,
          ...others,
          ...arr,
        }
        const data = await countAssignment(newObj)
        if (data && data.code === 200) {
          dispatch.project.update({
            taskNum: data.data,
          })
        } else {
          Notify.error({ title: data.message })
        }
      },

      // // 添加任务至我的待办
      // async addMyToDo(payload) {
      //   dispatch.project.update({
      //     handleState: true,
      //   })
      //   const { param, callback } = payload
      //   const data = await addMyToDo(param)
      //   if (data && data.code === 200) {
      //     dispatch.project.getSelectById({
      //       projectId: param?.projectId,
      //       id: param?.id,
      //     })
      //     callback && callback()
      //     dispatch.project.update({
      //       handleState: false,
      //     })
      //   } else {
      //     dispatch.project.update({
      //       handleState: false,
      //     })
      //   }
      // },
      // // 标记已完成
      // async getStrutsSwitch(payload) {
      //   dispatch.project.update({
      //     handleState: true,
      //   })
      //   const { param, todoData, callback } = payload
      //   const data = await getStrutsSwitch(todoData)
      //   if (data && data.code === 200) {
      //     dispatch.project.getSelectById({
      //       projectId: param?.projectId,
      //       id: param?.id,
      //     })
      //     callback && callback()
      //     dispatch.project.update({
      //       handleState: false,
      //     })
      //   } else {
      //     dispatch.project.update({
      //       handleState: false,
      //     })
      //   }
      // },
      // clean() {
      //   const dph = dispatch
      //   dph.project.update({
      //     issueType: 'cancel',
      //     queryInfo: {},
      //     isView: false,
      //   })
      // },
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
