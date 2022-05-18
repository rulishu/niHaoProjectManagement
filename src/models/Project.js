import { createModel } from '@rematch/core'
import {
  getSelectPage,
  getManagerAssignmentUpdate,
  getManagerAssignmentSelectById,
  getmMnagerAssignmentSave,
  deleteAssignment,
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
    dataList: [],
    total: 0,
    closeDataList: [],
    closeTotal: 0,
    openTataList: [{ companyId: 1, projectId: 1, assignmentId: 1 }],
    openTotal: 0,
    issueType: '',
    isView: false,
    queryInfo: {},
    taskInfoData: {
      operatingRecords: [
        { title: '用户cccc', text: '姓名', type: 1 },
        { title: '2022-05-17', text: '事件', type: 2 },
        { title: '3333', text: 'ccccc', type: 3 },
        { title: '4444', text: 'ddddd', type: 4 },
      ],
    },
    activeKey: '1',
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
      commentDescription: '### 33333',
      labels: [],
      fileId: [],
    },
  },
  effects: (dispatch) => {
    return {
      // 分页查询
      async getList(params, { project }) {
        const { assignmentStatus, ...others } = params
        const { filter } = project
        const taskId = sessionStorage.getItem('id')

        const data = await getSelectPage({
          ...filter,
          ...others,
          // projectId: 1594,
          projectId: taskId, // useLocation
        })
        if (data && data.code === 200) {
          if (assignmentStatus === '3') {
            dispatch.project.update({
              closeDataList: data?.data.list || [],
              closeTotal: data?.data.total,
            })
          } else if (assignmentStatus === '2') {
            dispatch.project.update({
              openTataList: data?.data.list || [],
              openTotal: data?.data.total,
            })
          } else if (assignmentStatus === '') {
            dispatch.project.update({
              dataList: data?.data.list || [],
              total: data?.data.total,
            })
          }
        }
      },
      // 翻页
      async goToPage(payload) {
        const { page, pageSize, assignmentStatus } = payload
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
      async getSelectById(params, { project }) {
        const data = await getManagerAssignmentSelectById({
          projectId: sessionStorage.getItem('id'),
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.update({
            taskInfoData: data?.data || {},
            editFromData: data?.data || {},
          })
        }
      },
      // 任务列表编辑
      async getEdit(params, { project }) {
        const { editFromData } = project
        const data = await getManagerAssignmentUpdate({
          projectId: Number(sessionStorage.getItem('id')),
          ...editFromData,
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.update({
            issueType: '',
            // editFromData: {
            //   assignmentTitle: '',
            //   description: '',
            //   labels: []
            // }
          })
          dispatch.project.getSelectById({ id: editFromData?.assignmentId })
          // navigate(`/project/task/${sessionStorage.getItem('id')}`)
          NotifySuccess(data.message)
        }
      },
      // 任务列表删除
      async deleteAssignment(params) {
        const data = await deleteAssignment(params)
        return data
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
