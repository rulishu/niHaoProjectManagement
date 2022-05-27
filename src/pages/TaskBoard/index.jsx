// import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
// import { Alert, Card } from 'uiw'
import styles from './index.module.less'

export default function TaskBoard() {
  // const dispatch = useDispatch()
  // const {team: { alertShow, ids },} = useSelector((state) => state)

  let data = [
    { id: '1', arr: [{ name: '沈建澄1' }, { name: '吴卫刚1' }] },
    {
      id: '2',
      arr: [{ name: '沈建澄' }, { name: '吴卫刚' }, { name: '洪高锋' }],
    },
  ]
  const onDragEnd = (result) => {
    console.log(result)
    const sourceDroppableId = result.source.droppableId
    const destinationDroppableId = result.destination?.droppableId
    const sourceIndex = result.source.index
    const destinationIndex = result.destination?.index
    const sourceList = data.filter((s) => s.id === sourceDroppableId)[0]
    const [draggedItem] = sourceList.arr.splice(sourceIndex, 1)
    if (sourceDroppableId !== destinationDroppableId) {
      const destinationList = data.filter(
        (s) => s.id === destinationDroppableId
      )[0]
      destinationList.arr.splice(destinationIndex, 0, draggedItem)
      data.map((item, index) => {
        if (item.id === destinationDroppableId) {
          data[index] = destinationList
        }
        return null
      })
      console.log(sourceList)
    } else {
      if (destinationIndex === sourceIndex) {
        return
      } else {
        sourceList.arr.splice(destinationIndex, 0, draggedItem)
        data.map((item, index) => {
          if (item.id === sourceDroppableId) {
            data[index] = sourceList
          }
          return null
        })
      }
    }
  }
  return (
    <div style={{ display: 'flex' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.drapItem}>
          {data.map((dropItem, dropIndex) => (
            <Droppable droppableId={dropItem.id} key={dropIndex}>
              {(provided) => {
                return (
                  <div
                    className="modalList"
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    {dropItem.arr.map((item, index) => (
                      <Draggable
                        draggableId={item.name}
                        index={index}
                        key={item.name}>
                        {(provided) => (
                          <div
                            className={styles.dragItem}
                            key={item.name}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            {item.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
