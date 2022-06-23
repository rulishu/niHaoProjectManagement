import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { Card, Icon, Avatar, Button, Input, Empty, Tooltip, Loader } from 'uiw'
import styles from './index.module.less'
import DeletePop from './DeletePop'
import Header from './Header'
import TaskDetail from './TaskDetail'
import EditDrop from './EditDrop'
import CreatList from './CreatList'
import ListButtonGroup from './ListButtonGroup'

const TaskBoard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { taskboard, loading } = useSelector((state) => state)
  const { projectId, userAccount } = useParams()
  const { boardList, list } = taskboard
  const [deleteBoardCon, setDeleteBoardCon] = useState(false) // 看板删除弹窗状态
  const [selectBoard, setSelectBoard] = useState(0) // 当前选择看板id
  const [selectList, setSelectList] = useState(0) // 当前选择列表id
  const [creatBut, setCreatBut] = useState(false) // 创建列表弹窗按钮
  const [editList, setEditList] = useState(false) // 编辑列表弹窗
  const [editBoardName, setEditBoardName] = useState('') // 编辑列表名
  const [deleteConfirmation, setDeleteConfirmation] = useState(false) // 列表删除弹窗状态
  const [creat, setCreat] = useState(false) // 创建列表弹窗
  const [taskDetails, setTaskDetails] = useState(false) // 小记详情抽屉
  const [itemName, setItemName] = useState('') // 新增小记时title
  const pageView = useRef(null)
  useEffect(() => {
    dispatch.taskboard.selectOneInfo({
      projectId,
      setSelectBoard,
      setCreatBut,
      first: true,
    })
  }, [dispatch, projectId])
  useEffect(() => {
    if (creatBut) {
      scrollToEle()
    } else {
      pageView.current.scrollLeft = 0
    }
  }, [creatBut])

  const deleteBoard = () => {
    //删除看板
    dispatch.taskboard.deleteBoard({
      projectId,
      id: selectBoard,
      setCreatBut,
      setDeleteBoardCon,
      setSelectBoard,
    })
  }

  const deleteList = () => {
    //删除列表
    dispatch.taskboard.deleteBoardList({
      id: selectList,
      boardId: selectBoard,
      setDeleteConfirmation,
    })
  }

  const editListName = (name) => {
    //编辑列表
    dispatch.taskboard.updateBoardList({
      id: selectList,
      boardId: selectBoard,
      listTitle: name,
      setEditList,
    })
  }

  const scrollToEle = () => {
    let rollTimer
    const leftWidth = pageView.current?.scrollWidth
    const initPosition = pageView.current.scrollLeft
    let speed = 2
    rollTimer = setInterval(() => {
      speed = speed * 1.5
      pageView.current.scrollLeft = initPosition + speed
      if (initPosition + speed > leftWidth - 100) {
        pageView.current.scrollLeft = leftWidth
        clearInterval(rollTimer)
      }
    }, 20)
  }

  const openTaskInfo = (item) => {
    dispatch.taskboard.selectByProjectId({
      projectId: projectId,
      id: item.assignmentId,
    })
    dispatch.taskboard.getAllLabelData({
      projectId: projectId,
    })
    dispatch.taskboard.getListAll({
      projectId: projectId,
      milestonesStatusList: [1, 2],
    })
    dispatch.taskboard.pullSelectAll({
      projectId: projectId,
      userName: '',
    })
    setTaskDetails(true)
  }
  const onDragEnd = (result) => {
    //列表拖动时回调方法
    const sourceDroppableId = result.source.droppableId
    const destinationDroppableId = result.destination?.droppableId
    const sourceIndex = result.source.index
    const destinationIndex = result.destination?.index
    const sourceList = list.filter(
      (s) => s.id.toString() === sourceDroppableId
    )[0]
    const destinationList = list.filter(
      (s) => s.id.toString() === destinationDroppableId
    )[0]
    if (sourceDroppableId !== destinationDroppableId) {
      if (result.destination !== null) {
        const [draggedItem] = sourceList.managerBoardNotes.splice(
          sourceIndex,
          1
        )
        destinationList.managerBoardNotes.splice(
          destinationIndex,
          0,
          draggedItem
        )
        list?.map((item, index) => {
          if (item.id.toString() === destinationDroppableId) {
            list[index] = destinationList
          }
          return null
        })
        dispatch.taskboard.dragAssignmentNote({
          noteId: result.draggableId,
          newListId: destinationDroppableId,
          oldListId: sourceDroppableId,
          boardId: list[0].boardId,
          newSort: destinationList.managerBoardNotes.length - destinationIndex,
          oldSort: sourceList.managerBoardNotes.length - sourceIndex + 1,
        })
      } else {
        return
      }
    } else {
      if (destinationIndex === sourceIndex) {
        return
      } else {
        const [draggedItem] = sourceList.managerBoardNotes.splice(
          sourceIndex,
          1
        )
        sourceList.managerBoardNotes.splice(destinationIndex, 0, draggedItem)
        list?.map((item, index) => {
          if (item.id === sourceDroppableId) {
            list[index] = sourceList
          }
          return null
        })
        dispatch.taskboard.dragAssignmentNote({
          noteId: result.draggableId,
          newListId: destinationDroppableId,
          oldListId: sourceDroppableId,
          boardId: list[0].boardId,
          newSort: sourceList.managerBoardNotes.length - destinationIndex,
          oldSort: sourceList.managerBoardNotes.length - sourceIndex,
        })
      }
    }
  }
  const isUrl = (url) => {
    if (url !== '') {
      const reg = /(http|ftp|https):?/
      if (reg.test(url)) {
        return true
      } else {
        return false
      }
    }
  }

  return (
    <div className={styles.content}>
      <Header
        param={{
          selectBoard,
          setDeleteBoardCon,
          setSelectBoard,
          setCreatBut,
          setCreat,
          creatBut,
          loading,
        }}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.drapItem} ref={pageView}>
          {list.length !== 0 ? (
            list?.map((dropItem, dropIndex) => {
              return (
                <Droppable droppableId={dropItem.id.toString()} key={dropIndex}>
                  {(provided) => {
                    return (
                      <div className={styles.dragList}>
                        <div className={styles.dragListHead}>
                          <p className={styles.listName}>
                            {dropItem.listTitle}
                          </p>
                          <div className={styles.listName}>
                            <Icon type="appstore-o" />
                            <span className={styles.listNum}>
                              {dropItem?.managerBoardNotes?.length}
                            </span>
                            <ListButtonGroup
                              param={{
                                dropIndex,
                                dropItem,
                                setDeleteConfirmation,
                                setEditList,
                                setEditBoardName,
                                setSelectList,
                              }}
                            />
                          </div>
                        </div>
                        <div
                          className={styles.dragListBox}
                          ref={provided.innerRef}
                          {...provided.droppableProps}>
                          {dropItem?.managerBoardNotes?.map((item, index) => {
                            if (item.new) {
                              return (
                                <div
                                  key={item.assignmentId}
                                  className={styles.newItem}>
                                  <p style={{ margin: '5px' }}>小记标题</p>
                                  <div>
                                    <Input
                                      style={{
                                        width: '100%',
                                        marginBottom: '8px',
                                      }}
                                      onChange={(e) => {
                                        setItemName(e.target.value)
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}>
                                    <Button
                                      loading={
                                        loading.effects.taskboard
                                          .quickInsertTransfer
                                      }
                                      type={
                                        itemName === '' ? 'light' : 'primary'
                                      }
                                      disabled={itemName === '' ? true : false}
                                      onClick={() => {
                                        dispatch.taskboard.quickInsertTransfer({
                                          listId: dropItem.id,
                                          boardId: dropItem.boardId,
                                          title: itemName,
                                          setItemName,
                                        })
                                      }}>
                                      创建小记
                                    </Button>
                                    <Button
                                      type="light"
                                      onClick={() => {
                                        const newList = list
                                        newList[
                                          dropIndex
                                        ]?.managerBoardNotes?.shift()
                                        dispatch.taskboard.update({
                                          list: newList,
                                        })
                                      }}>
                                      取消
                                    </Button>
                                  </div>
                                </div>
                              )
                            } else {
                              return (
                                <Draggable
                                  draggableId={item.noteId.toString()}
                                  index={index}
                                  key={item.noteId}>
                                  {(provided) => (
                                    <div
                                      className={styles.dragItem}
                                      key={item.noteId}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}>
                                      {item?.assignmentId !== 0 ? (
                                        <Card bordered={false}>
                                          <div className={styles.listItem}>
                                            <div>
                                              <div
                                                style={{ display: 'flex' }}
                                                onClick={() => {
                                                  openTaskInfo(item)
                                                }}>
                                                <Icon
                                                  color={
                                                    item.assignmentStatus === 3
                                                      ? '#d99156'
                                                      : '#57ab5a'
                                                  }
                                                  type={
                                                    item.assignmentStatus === 3
                                                      ? 'minus-circle-o'
                                                      : 'circle-o'
                                                  }
                                                />
                                                <div
                                                  className={styles.noteTitle}>
                                                  <span
                                                    className={
                                                      styles.listItemColor
                                                    }>
                                                    {item?.assignmentTitle}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className={styles.noteId}>
                                                #{item?.assignmentId}
                                              </div>
                                            </div>
                                            <div className={styles.userHead}>
                                              {item?.assigneeUserAvatar !==
                                                null && (
                                                <Tooltip
                                                  placement="bottom"
                                                  content={`指派给 ${item?.assigneeUserName}`}>
                                                  <Avatar
                                                    onClick={() => {
                                                      if (
                                                        item.assigneeUserAccount !==
                                                        null
                                                      ) {
                                                        navigate(
                                                          `/${item.assigneeUserAccount}`
                                                        )
                                                      }
                                                    }}
                                                    src={
                                                      isUrl(
                                                        item.assigneeUserAvatar
                                                      )
                                                        ? item.assigneeUserAvatar
                                                        : `/api/file/selectFile/${item.assigneeUserAvatar}`
                                                    }>
                                                    {item?.assigneeUserName !==
                                                      null &&
                                                      item?.assigneeUserName[0]}
                                                  </Avatar>
                                                </Tooltip>
                                              )}
                                            </div>
                                          </div>
                                        </Card>
                                      ) : (
                                        <Card bordered={false}>
                                          <div className={styles.listItem}>
                                            <div>
                                              <div style={{ display: 'flex' }}>
                                                <Icon type="tag-o" />
                                                <div
                                                  style={{
                                                    marginLeft: '5px',
                                                    fontSize: 18,
                                                  }}>
                                                  {item?.title}
                                                </div>
                                              </div>
                                              <div className={styles.noteDesc}>
                                                由{item?.createName} 于{' '}
                                                {item?.createTime.slice(0, 10)}{' '}
                                                创建
                                              </div>
                                            </div>
                                            <div style={{ margin: 'auto 0px' }}>
                                              <EditDrop
                                                rowData={{
                                                  boardId: selectBoard,
                                                  noteId: item.noteId,
                                                  title: item.title,
                                                  listId: item.listId,
                                                }}
                                                loading={loading}
                                              />
                                            </div>
                                          </div>
                                        </Card>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              )
                            }
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    )
                  }}
                </Droppable>
              )
            })
          ) : (
            <div className={styles.empty}>
              <Loader
                size="large"
                loading={loading.effects.taskboard.selectAllBoardNote}>
                {boardList.length ? (
                  creatBut ? (
                    <div></div>
                  ) : (
                    <Empty size="200px" />
                  )
                ) : (
                  <Empty size="200px" />
                )}
              </Loader>
            </div>
          )}
          <CreatList param={{ creat, setCreat, setCreatBut, selectBoard }} />
        </div>
      </DragDropContext>
      <DeletePop
        param={{
          setDeleteBoardCon,
          deleteBoard,
          editList,
          editBoardName,
          setEditList,
          editListName,
          deleteBoardCon,
          deleteConfirmation,
          setDeleteConfirmation,
          deleteList,
          loading,
        }}
      />
      <TaskDetail
        param={{
          setTaskDetails,
          taskDetails,
          projectId,
          userAccount,
          loading,
          selectBoard,
        }}
      />
    </div>
  )
}
export default TaskBoard
