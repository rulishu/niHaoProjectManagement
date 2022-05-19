import { useState } from 'react'
import { Icon, OverlayTrigger, Menu, Overlay, Card, Button } from 'uiw'
import styles from './index.module.less'
import './index.css'

const EditDrop = (props) => {
  const { rowData, dispatch, search } = props
  //操作弹窗
  const [dropOpen, setDropOpen] = useState(false)
  //删除弹窗
  const [deleteOpen, setDeleteOpen] = useState(false)
  const menu = () => (
    <div>
      <Menu bordered style={{ width: '200px' }}>
        <Menu.Item
          onClick={() => {
            dispatch.projectUpdate.updataProject({
              drawerType: 'edit',
              id: rowData.id,
            })
          }}
          icon="edit"
          text="编辑项目"
        />
        <Menu.Item
          onClick={() => {
            setDeleteOpen(true)
            setDropOpen(false)
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
        overlay={menu()}>
        <div onClick={() => setDropOpen(!dropOpen)}>
          <Icon type="more" />
        </div>
      </OverlayTrigger>
      <Overlay isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Card active style={{ width: '400px' }}>
          <strong style={{ padding: '5px' }}>删除 {rowData.name}？</strong>
          <div style={{ padding: '8px 15px' }}>
            您将删除 <strong>{rowData.name} </strong>,并且无法后续复原。
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="light" onClick={() => setDeleteOpen(false)}>
              取消
            </Button>
            <Button
              type="danger"
              onClick={() =>
                dispatch.projectlist.deleteProject({
                  id: rowData.id,
                  setDeleteOpen,
                  search,
                })
              }>
              删除项目
            </Button>
          </div>
        </Card>
      </Overlay>
    </div>
  )
}

export default EditDrop
