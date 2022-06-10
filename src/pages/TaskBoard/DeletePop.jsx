import { Button, Overlay, Card } from 'uiw'
import styles from './index.module.less'

/**
 * 删除看板弹窗
 */

const DeletePop = (props) => {
  const { setDeleteBoardCon, deleteBoard, deleteBoardCon } = props.param
  return (
    <Overlay isOpen={deleteBoardCon} onClose={() => setDeleteBoardCon(false)}>
      <Card style={{ width: 500 }}>
        <strong>确定删除此看板吗？</strong>
        <div>您将删除一个看板和看板中的内容</div>
        <br />
        <div className={styles.flexRight}>
          <Button type="light" onClick={() => setDeleteBoardCon(false)}>
            取消
          </Button>
          <Button type="danger" onClick={() => deleteBoard()}>
            删除
          </Button>
        </div>
      </Card>
    </Overlay>
  )
}
export default DeletePop
