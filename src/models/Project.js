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
import { getProjectCountById } from '../servers/projectoverview'
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
      milestonesId: 0,
      labels: [],
      fileId: [],
    },
    commentData: {
      operatingRecords: '',
    },
    teamMembers: [],
    assignmentLabels: [],
    milistones: [],
    splicingConditionsDtos: [],
    selectDtos: [], // 上方搜索条件
    tabDtos: [], // tab搜索条件
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
        const { filter, selectDtos, tabDtos } = project
        let obj = {
          ...filter,
          splicingConditionsDtos: [...selectDtos, ...tabDtos],
          ...others,
        }
        // if (splicingConditionsDtos.length > 0) {
        //   obj = { ...obj, splicingConditionsDtos }
        // }
        const data = await getSelectPage(obj)
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

        // let tabDtos = []
        // if (assignmentStatus !== '') {
        //   tabDtos = [
        //     {
        //       condition: '=',
        //       field: 'assignmentStatus',
        //       value: assignmentStatus,
        //     },
        //   ]
        // }
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

      // 查询成员
      async queryFuzzyAllProjectMember(params) {
        const data = await queryFuzzyAllProjectMember({
          ...params,
        })
        if (data && data.code === 200) {
          // console.log('data--->', data)
          if (data.data && data.data.length > 0) {
            const teamMembers = data.data.map((item) => ({
              label: item.memberName,
              value: item.userId,
            }))
            // console.log('teamMembers--->', teamMembers)
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
        let newLabels = []
        if (labels?.length > 0 && labels[0]?.dictValue) {
          // eslint-disable-next-line array-callback-return
          labels.map((item) => {
            newLabels.push(item?.dictValue.toString())
          })
          newData.labels = newLabels
        }
        const data = await getmMnagerAssignmentSave({
          ...newData,
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
        const { labels, ...newData } = project.editFromData
        let newLabels = []
        if (labels?.length > 0 && labels[0]?.dictValue) {
          // eslint-disable-next-line array-callback-return
          labels.map((item) => {
            newLabels.push(item?.dictValue.toString())
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
          dispatch.project.queryFuzzyAllProjectMember({
            userId: project?.teamMembers?.userId,
          })
          // console.log('teamMembers--->1111', project.teamMembers.userId)
          dispatch.project.update({
            commentData: {
              operatingRecords: '',
            },
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
