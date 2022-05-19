import { useState } from 'react'
import { Icon, OverlayTrigger, Menu } from 'uiw'
import styles from './index.module.less'
import './index.css'

const EditDrop = (props) => {
  const { rowData, dispatch, search } = props
  const [dropOpen, setDropOpen] = useState(false)
  const menu = (id) => (
    <div>
      <Menu bordered style={{ width: '200px' }}>
        <Menu.Item
          onClick={() => {
            dispatch.projectUpdate.updataProject({ drawerType: 'edit', id: id })
          }}
          icon="edit"
          text="编辑项目"
        />
        <Menu.Item
          onClick={() => {
            dispatch.projectlist.deleteProject({ id, setDropOpen, search })
          }}
          icon="delete"
          text="删除项目"
        />
      </Menu>
    </div>
  )
  return (
    <div className={styles.warp}>
      <OverlayTrigger
        placement="bottom"
        trigger="click"
        isOpen={dropOpen}
        overlay={menu(rowData.id)}>
        <div onClick={() => setDropOpen(!dropOpen)}>
          <Icon type="more" />
        </div>
      </OverlayTrigger>
    </div>
  )
}

export default EditDrop
