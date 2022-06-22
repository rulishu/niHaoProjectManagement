import { useState } from 'react'
import { Button, Card, Input } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.less'

/**
 * 删除看板弹窗
 */

const DeletePop = (props) => {
  const { creat, setCreat, setCreatBut, selectBoard } = props.param
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state)
  const [boardName, setBoardName] = useState('') // 新建列表名

  return (
    <>
      {creat && (
        <div style={{ width: '20%', display: 'flex', margin: '5px' }}>
          <Card
            title="新增列表"
            bodyClassName={styles.newListCardBody}
            footer={
              <div className={styles.newListButton}>
                <Button
                  onClick={() => {
                    setCreat(false)
                    setCreatBut(false)
                  }}>
                  取消
                </Button>
                <Button
                  disabled={boardName === '' ? true : false}
                  type={boardName === '' ? 'light' : 'primary'}
                  loading={loading.effects.taskboard.addBoardList}
                  onClick={() => {
                    dispatch.taskboard.addBoardList({
                      boardId: selectBoard,
                      listTitle: boardName,
                      setCreat,
                      setCreatBut,
                    })
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
    </>
  )
}
export default DeletePop
