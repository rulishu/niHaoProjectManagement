import { createModel } from '@rematch/core'
import { Notify } from 'uiw'
// import { Notify } from 'uiw'
import {
  selectAllBoard,
  selectAllBoardNote,
  addBoardList,
  deleteBoardList,
  dragAssignmentNote,
  quickInsertTransfer,
  deleteBoard,
  saveBoard,
  selectByProjectId,
  noteToAssignment,
  updateBoardNote,
  deleteBoardNote,
  pullSelectAll,
  updateBoardList,
  getSelectAll,
  changeAssignmentStatus,
  changeAssignmentMilestones,
  changeAssignmentUser,
  changeCloseTime,
  editBoard,
} from '../servers/taskBoard'

import { getAllLabelData } from '../servers/labels'
import { getManagerAssignmentUpdate } from '../servers/project'

/**
 * 项目列表
 */
const taskboard = createModel()({
  name: 'taskboard',
  state: {
    page: 1,
    pageSize: 10,
    total: 0,
    boardList: [],
    list: [],
    taskInfo: {},
    labelList: [],
    userAllList: [],
    taskDueDate: '',
    create: false,
    createBut: false,
  },
  reducers: {
    update: (state, payload) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    //查询项目中看板
    async selectOneInfo(payload, { taskboard }) {
      dispatch.taskboard.update({
        list: [],
      })
      const { pageSize, page, type } = taskboard
      const { projectId, setSelectBoard, first, creat, creatBoardId } = payload
      let params = {
        pageSize,
        page,
        type,
        projectId,
      }
      const data = await selectAllBoard(params)
      if (data && data.code === 200) {
        if (data?.data.length === 0) {
          dispatch.taskboard.update({
            createBut: true,
          })
        } else {
          dispatch.taskboard.update({
            createBut: false,
          })
        }
        dispatch.taskboard.update({
          boardList: data?.data || [],
        })
        setSelectBoard(data?.data[0]?.id)
        if (first && data?.data.length !== 0) {
          dispatch.taskboard.selectAllBoardNote({
            boardId: data?.data[0]?.id,
          })
        }
        if (creat && data?.data.length !== 0) {
          dispatch.taskboard.selectAllBoardNote({
            boardId: creatBoardId,
          })
          setSelectBoard(creatBoardId)
        }
      } else {
        dispatch.taskboard.update({
          createBut: true,
        })
      }
    },

    //查询看板中列表
    async selectAllBoardNote(payload) {
      const { ...other } = payload
      const data = await selectAllBoardNote(other)
      if (data && data.code === 200) {
        dispatch.taskboard.update({
          list: data?.data || [],
        })
        if (data?.data.length === 0) {
          dispatch.taskboard.update({
            create: true,
            createBut: true,
          })
          return
        }
        dispatch.taskboard.update({
          create: false,
          createBut: false,
        })
      }
    },

    //查询任务详情
    async selectByProjectId(payload) {
      const { ...other } = payload
      const data = await selectByProjectId(other)
      if (data && data.code === 200) {
        dispatch.taskboard.update({
          taskInfo: data?.data || {},
          taskDueDate: data?.data?.dueDate || '',
        })
      }
    },

    // 查询项目中标签
    async getAllLabelData(payload) {
      const data = await getAllLabelData({ ...payload })
      if (data && data.code === 200) {
        dispatch.taskboard.update({
          labelList: data?.data || [],
        })
      }
    },

    // 所有里程碑查询
    async getListAll(payload) {
      const data = await getSelectAll(payload)
      if (data.code === 200) {
        dispatch.taskboard.update({
          milepostaData: data?.data || [],
        })
      }
    },

    //新增看板列表
    async addBoardList(payload) {
      const { ...other } = payload
      const data = await addBoardList(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
        })
        dispatch.taskboard.update({
          create: false,
          createBut: false,
        })
      }
    },

    //新增代转任务
    async quickInsertTransfer(payload) {
      const { setItemName, ...other } = payload
      const data = await quickInsertTransfer(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
        })
        setItemName('')
      }
    },

    //新增看板
    async saveBoard(payload) {
      const { setIsOpen, setSelectBoard, ...other } = payload
      const data = await saveBoard(other)
      if (data && data.code === 200) {
        setIsOpen(false)
        const { projectId } = other
        Notify.success({ title: '新增看板成功' })
        dispatch.taskboard.selectOneInfo({
          boardId: payload.boardId,
          projectId,
          setSelectBoard,
          creat: true,
          creatBoardId: data.data.id,
        })
      }
    },

    //删除列表
    async deleteBoardList(payload) {
      const { setDeleteConfirmation, ...other } = payload
      const data = await deleteBoardList(other)
      if (data && data.code === 200) {
        Notify.success({ title: '删除成功' })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
        })
        setDeleteConfirmation(false)
      }
    },

    //删除note
    async deleteBoardNote(payload) {
      const { setEditOpen, boardId, ...other } = payload
      const data = await deleteBoardNote(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({
          boardId,
        })
        setEditOpen(false)
      }
    },

    //删除看板
    async deleteBoard(payload) {
      const { setDeleteBoardCon, setSelectBoard, projectId, id } = payload
      const data = await deleteBoard({ projectId, id })
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectOneInfo({
          boardId: payload.boardId,
          projectId,
          setSelectBoard,
          first: true,
        })
      }
      setDeleteBoardCon(false)
    },

    //item拖动到列表
    async dragAssignmentNote(payload) {
      const { ...other } = payload
      const data = await dragAssignmentNote(other)
      if (data && data.code === 200) {
        console.log()
      }
    },

    // 快速创建任务
    async noteToAssignment(payload) {
      const { ...other } = payload
      const data = await noteToAssignment(other)
      if (data && data.code === 200) {
        Notify.success({ title: '快速创建任务成功' })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
        })
      }
    },

    // 编辑note
    async updateBoardNote(payload) {
      const { setEditOpen, boardId, ...other } = payload
      const data = await updateBoardNote(other)
      if (data && data.code === 200) {
        Notify.success({ title: '编辑小记成功' })
        setEditOpen(false)
        dispatch.taskboard.selectAllBoardNote({ boardId })
      }
    },

    // 编辑list
    async updateBoardList(payload) {
      const { setEditList, boardId, ...other } = payload
      const data = await updateBoardList(other, boardId)
      if (data && data.code === 200) {
        Notify.success({ title: '编辑列表成功' })
        setEditList(false)
        dispatch.taskboard.selectAllBoardNote({ boardId })
      }
    },

    // 编辑任务状态
    async changeAssignmentStatus(payload) {
      const { setTaskDetails, boardId, ...other } = payload
      const data = await changeAssignmentStatus(other)
      if (data && data.code === 200) {
        Notify.success({ title: '更改任务状态成功' })
        if (setTaskDetails) {
          setTaskDetails(false)
          dispatch.taskboard.selectAllBoardNote({ boardId })
        }
      }
    },

    // 编辑任务指派人
    async changeAssignmentUser(payload) {
      const { selectBoard, ...other } = payload
      const data = await changeAssignmentUser(other)
      if (data && data.code === 200) {
        Notify.success({ title: '指派成功' })
        dispatch.taskboard.selectByProjectId({
          projectId: payload.projectId,
          id: payload.assignmentId,
        })
        dispatch.taskboard.selectAllBoardNote({ boardId: selectBoard })
      }
    },

    // 编辑任务里程碑
    async changeAssignmentMilestones(payload) {
      const { selectBoard, ...other } = payload
      const data = await changeAssignmentMilestones(other)
      if (data && data.code === 200) {
        dispatch.taskboard.selectByProjectId({
          projectId: payload.projectId,
          id: payload.assignmentId,
        })
      }
    },

    // 编辑任务
    async getEdit(payload) {
      const data = await getManagerAssignmentUpdate(payload.taskInfo)
      if (data && data.code === 200) {
        Notify.success({ title: '修改标签成功' })
      }
    },

    // 编辑任务截止日期
    async changeCloseTime(payload) {
      const data = await changeCloseTime(payload)
      if (data && data.code === 200) {
        Notify.success({ title: '截止日期已修改' })
        dispatch.taskboard.selectByProjectId({
          projectId: payload.projectId,
          id: payload.assignmentId,
        })
      }
    },

    //模糊查询所有用户
    async pullSelectAll(params) {
      const data = await pullSelectAll({
        ...params,
      })
      if (data && data.code === 200) {
        dispatch.taskboard.update({
          userAllList: data?.data || [],
        })
      }
    },

    //编辑看板
    async editBoard(params) {
      const { setIsEditBoard, ...other } = params
      const data = await editBoard({ ...other })
      if (data && data.code === 200) {
        Notify.success({ title: '编辑成功' })
        setIsEditBoard(false)
        dispatch.taskboard.selectOneInfo({
          first: true,
          projectId: other.projectId,
          setSelectBoard: other.setSelectBoard,
        })
      }
    },
  }),
})
export default taskboard
