import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  Card,
  Icon,
  Avatar,
  Button,
  Input,
  ButtonGroup,
  Overlay,
  Empty,
} from 'uiw'
import styles from './index.module.less'
import DeletePop from './DeletePop'
import Header from './Header'

const TaskBoard = () => {
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const { taskboard, loading } = useSelector((state) => state)
  const { boardList, list } = taskboard
  const [creatBut, setCreatBut] = useState(false) // 创建列表弹窗按钮
  const [deleteConfirmation, setDeleteConfirmation] = useState(false) // 列表删除弹窗状态
  const [deleteBoardCon, setDeleteBoardCon] = useState(false) // 看板删除弹窗状态
  const [selectList, setSelectList] = useState(0) // 当前选择列表id
  const [itemName, setItemName] = useState('') // 新增小记时title
  const [selectBoard, setSelectBoard] = useState(0) // 当前选择看板id
  const [creat, setCreat] = useState(false) // 创建列表弹窗
  const [boardName, setBoardName] = useState('') // 新建列表名
  useEffect(() => {
    dispatch.taskboard.selectOneInfo({
      projectId,
      setSelectBoard,
      setCreatBut,
      first: true,
    })
  }, [dispatch, projectId])

  const deleteBoard = () => {
    dispatch.taskboard.deleteBoard({
      projectId,
      id: selectBoard,
      setCreatBut,
      setDeleteBoardCon,
      setSelectBoard,
    })
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
        // dispatch.taskboard.dragAssignmentNote({
        //   noteId: result.draggableId,
        //   newListId: destinationDroppableId,
        //   boardId: list[0].boardId,
        //   newSort: destinationList.managerBoardNotes.length - destinationIndex,
        //   oldSort: sourceList.managerBoardNotes.length - sourceIndex,
        // })
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
        // dispatch.taskboard.dragAssignmentNote({
        //   noteId: result.draggableId,
        //   newListId: destinationDroppableId,
        //   boardId: list[0].boardId,
        //   newSort: sourceList.managerBoardNotes.length - destinationIndex,
        //   oldSort: sourceList.managerBoardNotes.length - sourceIndex,
        // })
      }
    }
  }

  return (
    <>
      <Header
        param={{
          selectBoard,
          setDeleteBoardCon,
          setSelectBoard,
          setCreatBut,
          setCreat,
          creatBut,
        }}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.drapItem}>
          {list.length !== 0 ? (
            list?.map((dropItem, dropIndex) => {
              return (
                <Droppable droppableId={dropItem.id.toString()} key={dropIndex}>
                  {(provided) => {
                    return (
                      <div
                        className={styles.dragList}
                        ref={provided.innerRef}
                        {...provided.droppableProps}>
                        <div className={styles.dragListHead}>
                          <p className={styles.listName}>
                            {dropItem.listTitle}
                          </p>
                          <div className={styles.listName}>
                            <Icon type="appstore-o" />
                            <span className={styles.listNum}>
                              {dropItem?.managerBoardNotes?.length}
                            </span>
                            <ButtonGroup>
                              <Button
                                onClick={() => {
                                  //添加item按钮
                                  const newList = list
                                  if (
                                    newList[dropIndex].managerBoardNotes
                                      .length !== 0 &&
                                    newList[dropIndex]?.managerBoardNotes[0]
                                      ?.new
                                  ) {
                                    newList[
                                      dropIndex
                                    ]?.managerBoardNotes?.shift()
                                  } else {
                                    newList[
                                      dropIndex
                                    ]?.managerBoardNotes?.unshift({
                                      assignmentId: 0,
                                      new: true,
                                    })
                                  }
                                  dispatch.taskboard.update({
                                    list: newList,
                                  })
                                }}>
                                <Icon type="plus" />
                              </Button>
                              <Button
                                onClick={() => {
                                  //删除列表
                                  setDeleteConfirmation(true)
                                  setSelectList(dropItem.id)
                                }}>
                                <Icon type="delete" />
                              </Button>
                            </ButtonGroup>
                          </div>
                        </div>
                        <div className={styles.dragListBox}>
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
                                              <div style={{ display: 'flex' }}>
                                                <Icon type="down-circle-o" />
                                                <div
                                                  style={{
                                                    fontSize: '18px',
                                                    color: '#007bff',
                                                    marginLeft: '5px',
                                                  }}>
                                                  {item?.assignmentTitle}
                                                </div>
                                              </div>
                                              <div
                                                style={{
                                                  fontSize: '12px',
                                                  color: '#5e5e5e',
                                                }}>
                                                #{item?.assignmentId}
                                              </div>
                                            </div>
                                            <div className={styles.userHead}>
                                              {item?.assigneeUserAvatar !==
                                                null && (
                                                <Avatar
                                                  src={`/api/file/selectFile/${item.assigneeUserAvatar}`}>
                                                  {item?.assigneeUserName !==
                                                    null &&
                                                    item?.assigneeUserName[0]}
                                                </Avatar>
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
                                                  style={{ marginLeft: '5px' }}>
                                                  {item?.title}
                                                </div>
                                              </div>
                                              <div
                                                style={{
                                                  fontSize: '10px',
                                                  color: '#5e5e5e',
                                                }}>
                                                由{item?.createName} 于{' '}
                                                {item?.createTime.slice(0, 10)}{' '}
                                                创建
                                              </div>
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
              {boardList.length ? (
                creatBut ? (
                  <div></div>
                ) : (
                  <Empty size="200px" />
                )
              ) : (
                <Empty size="200px" />
              )}
            </div>
          )}
          {creat && (
            <div style={{ width: '20%', display: 'flex', margin: '0px 10px' }}>
              <Card
                title="新增列表"
                bodyClassName={styles.newListCardBody}
                footer={
                  <div className={styles.newListButton}>
                    <Button
                      onClick={() => {
                        setCreat(false)
                        setCreatBut(false)
                      }}>
                      取消
                    </Button>
                    <Button
                      disabled={boardName === '' ? true : false}
                      type={boardName === '' ? 'light' : 'primary'}
                      loading={loading.effects.taskboard.addBoardList}
                      onClick={() => {
                        dispatch.taskboard.addBoardList({
                          boardId: selectBoard,
                          listTitle: boardName,
                          setCreat,
                          setCreatBut,
                        })
                      }}>
                      添加列表
                    </Button>
                  </div>
                }>
                <div>
                  <div className={styles.newList}>
                    <p style={{ marginBottom: '10px', fontSize: '12px' }}>
                      将会创建一个可拖入任务的列表
                    </p>
                    <Input
                      placeholder="请输入列表名称"
                      style={{ width: '260px' }}
                      onChange={(e) => {
                        setBoardName(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
          <Overlay
            isOpen={deleteConfirmation}
            onClose={() => setDeleteConfirmation(false)}>
            <Card active style={{ width: 500 }}>
              <strong style={{ margin: 0 }}>删除列表</strong>
              <div style={{ marginTop: '8px' }}>您确定您将删除这个list吗？</div>
              <br />
              <div className={styles.flexRight}>
                <Button
                  type="light"
                  onClick={() => setDeleteConfirmation(false)}>
                  取消
                </Button>
                <Button
                  loading={loading.effects.taskboard.deleteBoardNote}
                  type="danger"
                  onClick={() => {
                    dispatch.taskboard.deleteBoardNote({
                      id: selectList,
                      boardId: selectBoard,
                      setDeleteConfirmation,
                    })
                  }}>
                  删除列表
                </Button>
              </div>
            </Card>
          </Overlay>
        </div>
      </DragDropContext>
      <DeletePop param={{ setDeleteBoardCon, deleteBoard, deleteBoardCon }} />
    </>
  )
}
export default TaskBoard
