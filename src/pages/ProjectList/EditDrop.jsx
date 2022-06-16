import { useState } from 'react'
import { Icon, OverlayTrigger, Menu, Overlay, Card, Button } from 'uiw'
import styles from './index.module.less'
import './index.css'

const EditDrop = (props) => {
  const { rowData, dispatch, search } = props
  //操作弹窗
  const [dropOpen, setDropOpen] = useState(false)
  //删除（编辑）弹窗
  const [deleteOpen, setDeleteOpen] = useState(false)
  //弹窗内容 false为删除， true为关闭
  const [popContent, setPopContent] = useState('')
  const deletePro = () => {
    //删除项目方法
    // if (rowData.task === 0) {
    dispatch.projectlist.deleteProject({
      id: rowData.id,
      setDeleteOpen,
      search,
    })
    // } else {
    // Notify.error({ title: '该项目下存在任务，无法删除！' })
    // }
  }
  const closePro = (condition) => {
    //关闭||开启项目方法
    dispatch.projectlist.updateStatus({
      id: rowData.id,
      status: condition,
      setDeleteOpen,
      search,
    })
  }
  const menu = () => (
    <div>
      <Menu bordered style={{ width: '200px' }}>
        {rowData.status !== 2 && (
          <Menu.Item
            onClick={() => {
              setDropOpen(false)
              dispatch.projectUpdate.updataProject({
                drawerType: 'edit',
                id: rowData.id,
              })
            }}
            icon="edit"
            text="编辑项目"
          />
        )}
        {rowData.status !== 2 ? (
          <Menu.Item
            onClick={() => {
              setPopContent('关闭项目')
              setDeleteOpen(true)
              setDropOpen(false)
            }}
            icon="circle-close-o"
            text="关闭项目"
          />
        ) : (
          <Menu.Item
            onClick={() => {
              setPopContent('开启项目')
              setDeleteOpen(true)
              setDropOpen(false)
            }}
            icon="circle-close-o"
            text="开启项目"
          />
        )}
        <Menu.Item
          onClick={() => {
            setPopContent('删除项目')
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
        onClosing={() => {
          setDropOpen(false)
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
      <Overlay isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Card active style={{ width: '400px' }}>
          {popContent === '关闭项目' ? (
            <div>
              <strong style={{ padding: '5px' }}>关闭 {rowData.name}？</strong>
              <div>
                您将关闭 <strong>{rowData.name} </strong>，请确认
              </div>
            </div>
          ) : popContent === '删除项目' ? (
            <div>
              <strong style={{ padding: '5px' }}>删除 {rowData.name}？</strong>
              <div style={{ padding: '8px 15px' }}>
                您将删除 <strong>{rowData.name} </strong>
                ,并且会删除项目中存在的任务和里程碑，项目成员，无法后续复原。
              </div>
            </div>
          ) : popContent === '开启项目' ? (
            <div>
              <strong style={{ padding: '5px' }}>开启 {rowData.name}？</strong>
              <div style={{ padding: '8px 15px' }}>
                您将开启 <strong>{rowData.name} </strong>
              </div>
            </div>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="light" onClick={() => setDeleteOpen(false)}>
              取消
            </Button>
            <Button
              type="danger"
              onClick={() => {
                if (popContent === '关闭项目') {
                  closePro(2)
                } else if (popContent === '删除项目') {
                  deletePro()
                } else if (popContent === '开启项目') {
                  closePro(1)
                }
              }}>
              {popContent}
            </Button>
          </div>
        </Card>
      </Overlay>
    </div>
  )
}

export default EditDrop
