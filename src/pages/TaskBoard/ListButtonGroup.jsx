import { useDispatch, useSelector } from 'react-redux'
import { Button, ButtonGroup, Icon } from 'uiw'

/**
 * 列表按钮组
 */

const ListButtonGroup = (props) => {
  const {
    dropIndex,
    dropItem,
    setDeleteConfirmation,
    setEditList,
    setEditBoardName,
    setSelectList,
  } = props.param
  const dispatch = useDispatch()
  const { taskboard } = useSelector((state) => state)
  const { list } = taskboard
  return (
    <ButtonGroup>
      <Button
        onClick={() => {
          //添加item按钮
          const newList = list
          if (
            newList[dropIndex].managerBoardNotes.length !== 0 &&
            newList[dropIndex]?.managerBoardNotes[0]?.new
          ) {
            newList[dropIndex]?.managerBoardNotes?.shift()
          } else {
            newList[dropIndex]?.managerBoardNotes?.unshift({
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
          setEditBoardName(dropItem.listTitle)
          setEditList(true)
          setSelectList(dropItem.id)
        }}>
        <Icon type="edit" />
      </Button>
      <Button
        onClick={() => {
          setDeleteConfirmation(true)
          setSelectList(dropItem.id)
        }}>
        <Icon type="delete" />
      </Button>
    </ButtonGroup>
  )
}
export default ListButtonGroup
