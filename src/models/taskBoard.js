import { createModel } from '@rematch/core'
import { Notify } from 'uiw'
// import { Notify } from 'uiw'
import {
  selectAllBoard,
  selectAllBoardNote,
  addBoardList,
  deleteBoardNote,
  dragAssignmentNote,
  quickInsertTransfer,
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
        dispatch.taskboard.update({
          boardList: data?.data || [],
        })
        setSelectBoard(data?.data[0]?.id)
        if (first && data?.data.length !== 0) {
          dispatch.taskboard.selectAllBoardNote({
            boardId: data?.data[0]?.id,
            setCreatBut,
          })
        }
      }
    },

    //查询看板中列表
    async selectAllBoardNote(payload) {
      const { setCreatBut, ...other } = payload
      const data = await selectAllBoardNote(other)
      if (data && data.code === 200) {
        if (data?.data.length === 0) {
          setCreatBut(true)
        } else {
          setCreatBut(false)
        }
        dispatch.taskboard.update({
          list: data?.data || [],
        })
      } else {
        setCreatBut(true)
      }
    },

    //新增看板列表
    async addBoardList(payload) {
      const { setCreatBut, setCreat, ...other } = payload
      const data = await addBoardList(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
          setCreatBut,
        })
        setCreat(false)
      }
    },

    //新增代转任务
    async quickInsertTransfer(payload) {
      const { setCreatBut, setItemName, ...other } = payload
      const data = await quickInsertTransfer(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
          setCreatBut,
        })
        setItemName('')
      }
    },

    //删除列表
    async deleteBoardNote(payload) {
      const { setCreatBut, setDeleteConfirmation, ...other } = payload
      const data = await deleteBoardNote(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({
          boardId: payload.boardId,
          setCreatBut,
        })
        setDeleteConfirmation(false)
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
  }),
})
export default taskboard
