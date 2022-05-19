import { createModel } from '@rematch/core'
import {
  getSelectPage,
  getManagerAssignmentUpdate,
  getManagerAssignmentSelectById,
  getmMnagerAssignmentSave,
  deleteAssignment,
  getAssignmentHistorySave,
  queryFuzzyAllProjectMember,
  selectLabel,
  assignment_label,
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
    teamMembers: [],
    assignmentLabels: [],
    milistones: [],
    splicingConditionsDtos: [],
  },
  effects: (dispatch) => {
    return {
      // 分页查询
      async getList(params, { project }) {
        const { assignmentStatus, ...others } = params
        const { filter, splicingConditionsDtos } = project

        const data = await getSelectPage({
          ...filter,
          ...others,
          splicingConditionsDtos,
        })
        console.log('data: ', data)
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

      // 查询成员
      async queryFuzzyAllProjectMember(params) {
        const data = await queryFuzzyAllProjectMember({
          ...params,
        })
        if (data && data.code === 200) {
          if (data.data && data.data.length > 0) {
            const teamMembers = data.data.map((item) => ({
              label: item.memberName,
              value: item.id,
            }))
            dispatch.project.update({ teamMembers })
          }
        }
      },

      // 查询所有里程碑页签
      async selectLabel(params) {
        const data = await selectLabel({
          ...params,
        })
        if (data && data.code === 200) {
          if (data.data && data.data.length > 0) {
            // const milistone = data.data.map((item) => ({
            //   label: item.memberName,
            //   value: item.id,
            // }))
            // dispatch.project.update({ milistone })
          }
        }
      },
      //
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
      // 添加评论
      async getAddComment(params, { project }) {
        const data = await getAssignmentHistorySave({
          ...project.commentData,
          ...params,
        })
        if (data && data.code === 200) {
          dispatch.project.getSelectById({
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
