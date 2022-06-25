import { useState, useEffect } from 'react'
import { Button, Overlay, Card, Input, Modal } from 'uiw'
import styles from './index.module.less'

/**
 * 删除弹窗
 */

const DeletePop = (props) => {
  const {
    setDeleteBoardCon,
    deleteBoard,
    deleteBoardCon,
    deleteConfirmation,
    setDeleteConfirmation,
    loading,
    deleteList,
    editBoardName,
    editList,
    setEditList,
    editListName,
  } = props.param

  const [editName, setEditName] = useState('') // 编辑列表名input的值

  useEffect(() => {
    setEditName(editBoardName)
  }, [editBoardName])

  return (
    <>
      <Overlay isOpen={deleteBoardCon} onClose={() => setDeleteBoardCon(false)}>
        <Card style={{ width: 500 }}>
          <strong>确定删除此看板吗？</strong>
          <div>您将删除一个看板和看板中的内容</div>
          <br />
          <div className={styles.flexRight}>
            <Button type="light" onClick={() => setDeleteBoardCon(false)}>
              取消
            </Button>
            <Button
              type="danger"
              loading={loading.effects.taskboard.deleteBoard}
              onClick={() => deleteBoard()}>
              删除
            </Button>
          </div>
        </Card>
      </Overlay>
      {/* <Overlay
        isOpen={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}>
        <Card active style={{ width: 500 }}>
          <strong style={{ margin: 0 }}>删除列表</strong>
          <div style={{ marginTop: '8px' }}>您确定您将删除这个列表吗？</div>
          <br />
          <div className={styles.flexRight}>
            <Button type="light" onClick={() => setDeleteConfirmation(false)}>
              取消
            </Button>
            <Button
              loading={loading.effects.taskboard.deleteBoardList}
              type="danger"
              onClick={() => deleteList()}>
              删除列表
            </Button>
          </div>
        </Card>
      </Overlay> */}
      <Modal
        title="删除提示"
        isOpen={deleteConfirmation}
        confirmText="确定"
        cancelText="取消"
        icon="information"
        type="danger"
        onConfirm={() => deleteList()}
        onCancel={() => setDeleteConfirmation(false)}
        onClosed={() => setDeleteConfirmation(false)}>
        <div>
          确定要删除这个列表吗？
          {/* 删除列表?
          <br />
          <strong>您确定您将删除这个列表吗？!</strong> */}
        </div>
      </Modal>
      <Overlay isOpen={editList} onClose={() => setEditList(false)}>
        <Card title={`编辑 ${editBoardName}`} active style={{ width: 500 }}>
          <strong style={{ margin: 0 }}>列表名称</strong>
          <div style={{ marginTop: '10px' }}>
            <Input
              placeholder="请输入列表名称"
              value={editName}
              onInput={(e) => {
                setEditName(e.target.value)
              }}
            />
          </div>
          <div className={styles.flexRight} style={{ marginTop: '10px' }}>
            <Button
              loading={loading.effects.taskboard.updateBoardList}
              type="primary"
              onClick={() => {
                editListName(editName)
              }}>
              保存列名
            </Button>
          </div>
        </Card>
      </Overlay>
    </>
  )
}
export default DeletePop
