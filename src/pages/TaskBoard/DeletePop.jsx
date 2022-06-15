import { Button, Overlay, Card } from 'uiw'
import styles from './index.module.less'

/**
 * 删除看板弹窗
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
  } = props.param
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
      <Overlay
        isOpen={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}>
        <Card active style={{ width: 500 }}>
          <strong style={{ margin: 0 }}>删除列表</strong>
          <div style={{ marginTop: '8px' }}>您确定您将删除这个list吗？</div>
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
      </Overlay>
    </>
  )
}
export default DeletePop
