import { createModel } from '@rematch/core'
import { Notify } from 'uiw'
// import { Notify } from 'uiw'
import {
  selectAllBoard,
  selectAllBoardNote,
  addNote,
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
      const { projectId, setSelectBoard, first } = payload
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
        if (first) {
          dispatch.taskboard.selectAllBoardNote({ boardId: data?.data[0]?.id })
        }
      }
    },

    //查询看板中列表
    async selectAllBoardNote(payload) {
      const data = await selectAllBoardNote(payload)
      if (data && data.code === 200) {
        dispatch.taskboard.update({
          list: data?.data || [],
        })
      }
    },

    //新增看板列表
    async addNote(payload) {
      const { setCreat, ...other } = payload
      const data = await addNote(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({ boardId: payload.boardId })
        setCreat(false)
      }
    },

    //删除列表
    async deleteBoardNote(payload) {
      const { setDeleteConfirmation, ...other } = payload
      const data = await deleteBoardNote(other)
      if (data && data.code === 200) {
        Notify.success({ title: data.message })
        dispatch.taskboard.selectAllBoardNote({ boardId: payload.boardId })
        setDeleteConfirmation(false)
      }
    },
  }),
})
export default taskboard
