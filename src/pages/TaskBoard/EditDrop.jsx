import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Icon, OverlayTrigger, Menu, Loader } from 'uiw'
import styles from './index.module.less'

const EditDrop = (props) => {
  const { rowData, loading } = props
  const { noteId, boardId } = rowData
  //操作弹窗
  const [dropOpen, setDropOpen] = useState(false)
  const dispatch = useDispatch()
  const menu = () => (
    <div>
      <Menu bordered style={{ width: '200px' }}>
        <Loader
          style={{ width: '100%' }}
          loading={loading.effects.taskboard.noteToAssignment}>
          <Menu.Item
            onClick={() => {
              dispatch.taskboard.noteToAssignment({
                noteId,
                boardId,
              })
            }}
            icon="reload"
            text="快速创建任务"
          />
        </Loader>
        {/* <Menu.Item
            onClick={() => {
              console.log("编辑");
            }}
            icon="edit"
            text="编辑项目"
          />
        <Menu.Item
          onClick={() => {
            console.log('删除');
          }}
          icon="delete"
          text="删除项目"
        /> */}
      </Menu>
    </div>
  )
  return (
    <div className={styles.warp}>
      <OverlayTrigger
        placement="bottom"
        trigger="click"
        isOpen={dropOpen}
        onClosing={() => {
          setDropOpen(!dropOpen)
        }}
        overlay={menu()}>
        <div
          className={styles.editDropTrigger}
          onClick={() => {
            setDropOpen(!dropOpen)
          }}>
          <Icon type="more" />
        </div>
      </OverlayTrigger>
    </div>
  )
}

export default EditDrop
