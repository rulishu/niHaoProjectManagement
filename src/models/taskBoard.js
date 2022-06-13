import { createModel } from '@rematch/core'
import { Notify } from 'uiw'
// import { Notify } from 'uiw'
import {
  selectAllBoard,
  selectAllBoardNote,
  addBoardList,
  // deleteBoardList,
  dragAssignmentNote,
  quickInsertTransfer,
  deleteBoard,
  saveBoard,
  selectByProjectId,
  noteToAssignment,
  updateBoardNote,
  deleteBoardNote,
} from '../servers/taskBoard'

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
      const { projectId, setSelectBoard, first, setCreatBut } = payload
      let params = {
        pageSize,
        page,
        type,
        projectId,
      }
      const data = await selectAllBoard(params)
      if (data && data.code === 200) {
        if (data?.data.length === 0) {
          setCreatBut(true)
        } else {
          setCreatBut(false)
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
      } else {
        setCreatBut(true)
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
      }
    },

    //查询任务详情
    async selectByProjectId(payload) {
      const { ...other } = payload
      const data = await selectByProjectId(other)
      if (data && data.code === 200) {
        dispatch.taskboard.update({
          taskInfo: data?.data || {},
        })
      }
    },

    //新增看板列表
    async addBoardList(payload) {
      const { setCreat, setCreatBut, ...other } = payload
      const data = await addBoardList(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
        })
        setCreat(false)
        setCreatBut(false)
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
      const { setCreatBut, setIsOpen, setSelectBoard, ...other } = payload
      const data = await saveBoard(other)
      if (data && data.code === 200) {
        setIsOpen(false)
        const { projectId } = other
        Notify.success({ title: '新增看板成功' })
        dispatch.taskboard.selectOneInfo({
          boardId: payload.boardId,
          setCreatBut,
          projectId,
          setSelectBoard,
        })
      }
    },

    // //删除列表
    // async deleteBoardList(payload) {
    //   const { setDeleteConfirmation, ...other } = payload
    //   const data = await deleteBoardList(other)
    //   if (data && data.code === 200) {
    //     Notify.success({ title: data.message })
    //     dispatch.taskboard.selectAllBoardNote({
    //       boardId: payload.boardId,
    //     })
    //     setDeleteConfirmation(false)
    //   }
    // },

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
      const { setCreatBut, setDeleteBoardCon, setSelectBoard, projectId, id } =
        payload
      const data = await deleteBoard({ projectId, id })
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        setDeleteBoardCon(false)
        dispatch.taskboard.selectOneInfo({
          boardId: payload.boardId,
          setCreatBut,
          projectId,
          setSelectBoard,
          first: true,
        })
      }
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
  }),
})
export default taskboard
