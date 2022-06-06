import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, Icon, Avatar, Button, Input, ButtonGroup, Overlay } from 'uiw'
import { CompDropdown } from '@/components'
import { initListData } from '@/utils/utils'
import styles from './index.module.less'

const TaskBoard = () => {
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const { taskboard, loading } = useSelector((state) => state)
  const { boardList, list } = taskboard
  const [isOpen, setIsOpen] = useState(false) // 看板选择组件是否打开状态
  const [deleteConfirmation, setDeleteConfirmation] = useState(false) // 列表删除弹窗状态
  const [selectList, setSelectList] = useState(0) // 当前选择列表id
  const [selectBoard, setSelectBoard] = useState(0) // 当前选择看板id
  const [creat, setCreat] = useState(false) // 创建列表弹窗
  const [boardName, setBoardName] = useState('') // 新建列表名
  useEffect(() => {
    dispatch.taskboard.selectOneInfo({ projectId, setSelectBoard, first: true })
  }, [dispatch, projectId])

  const onDragEnd = (result) => {
    console.log(result)
    const sourceDroppableId = result.source.droppableId
    const destinationDroppableId = result.destination?.droppableId
    const sourceIndex = result.source.index
    const destinationIndex = result.destination?.index
    if (
      sourceDroppableId !== destinationDroppableId &&
      destinationDroppableId
    ) {
      const sourceList = list.filter(
        (s) => s.id.toString() === sourceDroppableId
      )[0]
      const [draggedItem] = sourceList.assignmentList.splice(sourceIndex, 1)
      const destinationList = list.filter(
        (s) => s.id.toString() === destinationDroppableId
      )[0]
      console.log(destinationDroppableId)
      destinationList.assignmentList.splice(destinationIndex, 0, draggedItem)
      list?.map((item, index) => {
        if (item.id.toString() === destinationDroppableId) {
          list[index] = destinationList
        }
        return null
      })
    } else {
      if (destinationIndex === sourceIndex) {
        return
      } else {
        const sourceList = list.filter(
          (s) => s.id.toString() === sourceDroppableId
        )[0]
        const [draggedItem] = sourceList.assignmentList.splice(sourceIndex, 1)
        sourceList.assignmentList.splice(destinationIndex, 0, draggedItem)
        list?.map((item, index) => {
          if (item.id === sourceDroppableId) {
            list[index] = sourceList
          }
          return null
        })
      }
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div style={{ width: '200px' }}>
          <CompDropdown
            listData={initListData(boardList, selectBoard, 'id', {
              title: 'name',
            })}
            title="看板"
            isGonnaHitDeselect={false}
            isOpen={isOpen}
            isRadio={true}
            labelHeader={[
              {
                title: '标题',
                dataIndex: 'title',
                resultsShow: true,
                isSearch: true,
                component: (item) => {
                  // console.log(item);
                  return <span>{item?.title}</span>
                },
              },
            ]}
            actionButtons={{
              manage: { title: '删除看板' },
              create: { title: '创建看板' },
            }}
            form={{
              fields: (props) => {
                return {
                  milestonesTitle: {
                    inline: true,
                    required: true,
                    children: <Input placeholder="请输入标题" />,
                  },
                }
              },
              fieldsShow: ({ fields, state, canSubmit, resetForm }) => {
                return (
                  <>
                    {' '}
                    <div>{fields.milestonesTitle}</div>{' '}
                  </>
                )
              },
            }}
            template="milepost"
            shape="input"
            runLabel={() => {
              console.log('删除')
            }}
            onChange={(e) => {
              setSelectBoard(e)
              setIsOpen(false)
              dispatch.taskboard.selectAllBoardNote({ boardId: e })
            }}
            onClickable={(is) => {
              setIsOpen(is)
            }}
            createTag={(icutData, nitData) => {
              console.log('1312', icutData, nitData)
            }}
          />
        </div>
        <Button
          type={creat ? 'light' : 'primary'}
          disabled={creat}
          onClick={() => {
            setCreat(true)
          }}>
          创建列表
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.drapItem}>
          {list?.map((dropItem, dropIndex) => {
            return (
              <Droppable droppableId={dropItem.id.toString()} key={dropIndex}>
                {(provided) => {
                  return (
                    <div
                      className={styles.dragList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}>
                      <div className={styles.dragListHead}>
                        <p className={styles.listName}>{dropItem.noteTitle}</p>
                        <div className={styles.listName}>
                          <Icon type="appstore-o" />
                          <span className={styles.listNum}>
                            {dropItem.assignmentList.length}
                          </span>
                          <ButtonGroup>
                            <Button>
                              <Icon type="plus" />
                            </Button>
                            <Button
                              onClick={() => {
                                setDeleteConfirmation(true)
                                setSelectList(dropItem.noteId)
                              }}>
                              <Icon type="delete" />
                            </Button>
                          </ButtonGroup>
                        </div>
                      </div>
                      <div className={styles.dragListBox}>
                        {dropItem.assignmentList.map((item, index) => {
                          return (
                            <Draggable
                              draggableId={item.assignmentId.toString()}
                              index={index}
                              key={item.assignmentId}>
                              {(provided) => (
                                <div
                                  className={styles.dragItem}
                                  key={item.assignmentId}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <Card bordered={false}>
                                    <div className={styles.listItem}>
                                      <div>
                                        <div>{item?.assignmentTitle}</div>
                                        <div>{item?.labels}</div>
                                        <div>{item?.assignmentId}</div>
                                      </div>
                                      <div className={styles.userHead}>
                                        {item?.assigneeUserId !== 1 && (
                                          <Avatar
                                            src={`/api/file/selectFile/${item.assigneeUserAvatar}`}>
                                            {/* {item?.assigneeUserName[0]} */}
                                          </Avatar>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    </div>
                  )
                }}
              </Droppable>
            )
          })}
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
                      }}>
                      取消
                    </Button>
                    <Button
                      disabled={boardName === '' ? true : false}
                      type={boardName === '' ? 'light' : 'primary'}
                      loading={loading.effects.taskboard.addNote}
                      onClick={() => {
                        dispatch.taskboard.addNote({
                          boardId: selectBoard,
                          title: boardName,
                          setCreat,
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
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                      noteId: selectList,
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
    </>
  )
}

export default TaskBoard
