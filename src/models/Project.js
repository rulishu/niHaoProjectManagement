import { createModel } from '@rematch/core'
import {
  getSelectPage,
  getManagerAssignmentUpdate,
  getManagerAssignmentSelectById,
  getmMnagerAssignmentSave,
  deleteAssignment,
  getAssignmentHistorySave,
} from '../servers/project'
import { Notify } from 'uiw'

const NotifySuccess = (message) => {
  return Notify.success({ title: message, description: '' })
}

const userData = JSON.parse(localStorage.getItem('userData'))
/**
 * 任务Project
 */
export default createModel()({
  name: 'project',
  state: {
    filter: {
      page: 1,
      pageSize: 10,
    },
    prepareList: [],
    prepareTotal: 0,
    openTataList: [],
    openTotal: 0,
    closeDataList: [],
    closeTotal: 0,
    issueType: '',
    isView: false,
    queryInfo: {},
    taskInfoData: {},
    activeKey: '2',
    fromData: {
      createId: userData?.id,
      createName: userData?.userName,
      assignmentTitle: '',
      assignmentType: 1,
      description: '',
      projectId: '',
      labels: [],
    },
    editFromData: {
      assignmentTitle: '',
      description: '',
      commentDescription: '',
      labels: [],
      fileId: [],
    },
    commentData: {},
  },
  effects: (dispatch) => {
    return {
      // 分页查询
      async getList(params, { project }) {
        const { assignmentStatus, ...others } = params
        const { filter } = project

        const data = await getSelectPage({
          ...filter,
          ...others,
        })
        if (data && data.code === 200) {
          if (assignmentStatus === '1') {
            dispatch.project.update({
              prepareList: data?.data.list || [],
              prepareTotal: data?.data.total,
            })
          } else if (assignmentStatus === '2') {
            dispatch.project.update({
              openTataList: data?.data.list || [],
              openTotal: data?.data.total,
            })
          } else if (assignmentStatus === '3') {
            dispatch.project.update({
              closeDataList: data?.data.list || [],
              closeTotal: data?.data.total,
            })
          } else if (assignmentStatus === '4') {
            dispatch.project.update({
              overtimeList: data?.data.list || [],
              overtimeTotal: data?.data.total,
            })
          } else {
            dispatch.project.update({
              dataList: data?.data.list || [],
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
        let splicingConditionsDtos = []
        if (assignmentStatus !== '') {
          splicingConditionsDtos = [
            {
              condition: '=',
              field: 'assignmentStatus',
              value: assignmentStatus,
            },
          ]
        }

        await dispatch.project.getList({
          page,
          pageSize,
          assignmentStatus,
          splicingConditionsDtos,
          projectId,
        })
      },

      // 任务列表新增
      async getAdd(params, { project }) {
        const { fromData } = project
        const data = await getmMnagerAssignmentSave({
          ...fromData,
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.update({
            issueType: '',
          })
          window.history.back(-1)
          Notify.success({ title: data.message, description: '' })
        }
      },

      // 任务列表查详情
      async getSelectById(params) {
        const data = await getManagerAssignmentSelectById({
          // projectId: sessionStorage.getItem('id')
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
            },
          })
        }
      },
      // 任务列表编辑
      async getEdit(params, { project }) {
        const { labels, ...newData } = project.editFromData
        let newLabels = []
        if (labels?.length > 0) {
          // eslint-disable-next-line array-callback-return
          labels.map((item) => {
            newLabels.push(item.dictCode.toString())
          })
          newData.labels = newLabels
        }
        const data = await getManagerAssignmentUpdate({
          ...newData,
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.update({
            issueType: '',
          })
          dispatch.project.getSelectById({
            projectId: params?.projectId || newData?.projectId,
            id: newData?.assignmentId,
          })
          // navigate(`/project/task/${sessionStorage.getItem('id')}`)
          NotifySuccess(data.message)
        }
      },
      // 任务列表删除
      async deleteAssignment(params) {
        const data = await deleteAssignment(params)
        return data
      },
      // 添加评论
      async getAddComment(params, { project }) {
        const data = await getAssignmentHistorySave({
          ...project.commentData,
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.getSelectById({
            projectId: project?.commentData?.projectId,
            id: project?.commentData?.assignmentId,
          })
          NotifySuccess(data.message)
        }
      },
      clean() {
        const dph = dispatch
        dph.project.update({
          issueType: '',
          queryInfo: {},
          isView: false,
        })
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
