import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, Icon, Avatar, Button, Input } from 'uiw'
import styles from './index.module.less'

const TaskBoard = () => {
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const { taskboard } = useSelector((state) => state)
  console.log(taskboard)
  const [dataInfo, setDataInfo] = useState([
    {
      id: '1',
      listName: '测试列表1',
      arr: [
        {
          issueName: '沈建澄1',
          issueLable: 'bug',
          issueNumber: '#225',
          nickName: 'fgh',
        },
        {
          issueName: '吴卫刚1',
          issueLable: '待测试',
          issueNumber: '#222',
          nickName: 'hgf',
        },
      ],
    },
    {
      id: '2',
      listName: '测试列表2',
      arr: [
        {
          issueName: '沈建澄',
          issueLable: 'creat',
          issueNumber: '#115',
          nickName: 'asd',
        },
        {
          issueName: '吴卫刚',
          issueLable: '已测试',
          issueNumber: '#654',
          nickName: 'dsa',
        },
        {
          issueName: '洪高锋',
          issueLable: '起飞',
          issueNumber: '#335',
          nickName: 'qwe',
        },
        {
          issueName: '沈建2澄',
          issueLable: 'creat',
          issueNumber: '#115',
          nickName: 'ewq',
        },
        {
          issueName: '吴卫2刚',
          issueLable: '已测试',
          issueNumber: '#654',
          nickName: 'rty',
        },
        {
          issueName: '洪高2锋',
          issueLable: '起飞',
          issueNumber: '#335',
          nickName: 'yrt',
        },
      ],
    },
  ])
  const [creat, setCreat] = useState(false) // 创建列表弹窗
  const [boardName, setBoardName] = useState('') // 新建列表名
  useEffect(() => {
    dispatch.taskboard.selectOneInfo({ projectId })
  }, [dispatch, projectId])

  const onDragEnd = (result) => {
    const sourceDroppableId = result.source.droppableId
    const destinationDroppableId = result.destination?.droppableId
    const sourceIndex = result.source.index
    const destinationIndex = result.destination?.index
    if (
      sourceDroppableId !== destinationDroppableId &&
      destinationDroppableId
    ) {
      const sourceList = dataInfo.filter((s) => s.id === sourceDroppableId)[0]
      const [draggedItem] = sourceList.arr.splice(sourceIndex, 1)
      const destinationList = dataInfo.filter(
        (s) => s.id === destinationDroppableId
      )[0]
      destinationList.arr.splice(destinationIndex, 0, draggedItem)
      dataInfo?.map((item, index) => {
        if (item.id === destinationDroppableId) {
          dataInfo[index] = destinationList
        }
        return null
      })
    } else {
      if (destinationIndex === sourceIndex) {
        return
      } else {
        const sourceList = dataInfo.filter((s) => s.id === sourceDroppableId)[0]
        const [draggedItem] = sourceList.arr.splice(sourceIndex, 1)
        sourceList.arr.splice(destinationIndex, 0, draggedItem)
        dataInfo?.map((item, index) => {
          if (item.id === sourceDroppableId) {
            dataInfo[index] = sourceList
          }
          return null
        })
      }
    }
  }

  return (
    <>
      <div className={styles.header}>
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
          {dataInfo?.map((dropItem, dropIndex) => {
            return (
              <Droppable droppableId={dropItem.id} key={dropIndex}>
                {(provided) => {
                  return (
                    <div
                      className={styles.dragList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}>
                      <div className={styles.dragListHead}>
                        <p className={styles.listName}>{dropItem.listName}</p>
                        <div className={styles.listName}>
                          <Icon type="appstore-o" />
                          <span className={styles.listNum}>
                            {dropItem.arr.length}
                          </span>
                          <Icon type="plus-square-o" />
                        </div>
                      </div>
                      <div className={styles.dragListBox}>
                        {dropItem.arr.map((item, index) => (
                          <Draggable
                            draggableId={item.issueName}
                            index={index}
                            key={item.issueName}>
                            {(provided) => (
                              <div
                                className={styles.dragItem}
                                key={item.issueName}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <Card bordered={false}>
                                  <div className={styles.listItem}>
                                    <div>
                                      <div>{item.issueName}</div>
                                      <div>{item.issueLable}</div>
                                      <div>{item.issueNumber}</div>
                                    </div>
                                    <div className={styles.userHead}>
                                      <Avatar
                                        src={
                                          item.avatar
                                            ? `/api/file/selectFile/${item.avatar}`
                                            : item.path
                                        }>
                                        {item?.nickName[0]}
                                      </Avatar>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
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
                      onClick={() => {
                        setCreat(false)
                        setDataInfo([
                          ...dataInfo,
                          { id: '9', listName: boardName, arr: [] },
                        ])
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
        </div>
      </DragDropContext>
    </>
  )
}

export default TaskBoard
