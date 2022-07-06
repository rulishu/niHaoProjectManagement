import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Icon,
  OverlayTrigger,
  Menu,
  Loader,
  Overlay,
  Button,
  Card,
  Textarea,
  Modal,
} from 'uiw'
import styles from './index.module.less'

const EditDrop = (props) => {
  const { rowData, loading, type } = props
  const { noteId, boardId, title, listId } = rowData
  const { projectId } = useParams()
  //操作弹窗
  const [dropOpen, setDropOpen] = useState(false)
  //编辑弹窗
  const [editOpen, setEditOpen] = useState(false)
  //编辑note的title
  const [noteTitle, setNoteTitle] = useState(title)
  //弹窗类型
  const [popContent, setPopContent] = useState('')
  const dispatch = useDispatch()
  const editNote = () => {
    //点击编辑按钮回调
    setPopContent('edit')
    setDropOpen(false)
    setEditOpen(true)
  }
  const deleteNote = () => {
    //点击删除按钮回调
    setPopContent('delete')
    setDropOpen(false)
    setEditOpen(true)
  }
  const menu = () => {
    if (type === 'edit') {
      return (
        <div>
          <Menu bordered style={{ width: '140px' }}>
            <Loader
              style={{ width: '100%' }}
              loading={loading.effects.taskboard.noteToAssignment}>
              <Menu.Item
                onClick={() => {
                  dispatch.taskboard.noteToAssignment({
                    noteId,
                    boardId,
                    projectId,
                  })
                }}
                icon="reload"
                text="快速创建任务"
              />
            </Loader>
            <Menu.Item onClick={() => editNote()} icon="edit" text="编辑小记" />
            <Menu.Item
              onClick={() => deleteNote()}
              icon="delete"
              text="删除小记"
            />
          </Menu>
        </div>
      )
    }
    if (type === 'task') {
      return (
        <div>
          <Menu bordered style={{ width: '140px' }}>
            <Menu.Item
              onClick={() => deleteNote()}
              icon="delete"
              text="删除小记"
            />
          </Menu>
        </div>
      )
    }
  }

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
      {popContent === 'edit' ? (
        <Overlay isOpen={editOpen} onClose={() => setEditOpen(false)}>
          <Card active style={{ width: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: '18px' }}>小记</strong>
              <Button
                icon="close"
                basic
                onClick={() => {
                  setEditOpen(false)
                }}></Button>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Textarea
                value={noteTitle}
                onChange={(e) => {
                  setNoteTitle(e.target.value)
                }}
                style={{
                  minHeight: '200px',
                  maxWidth: '200px',
                  maxHeight: '400px',
                  fontSize: '16px',
                }}
                placeholder="请输入内容"
              />
            </div>
            <br />
            <div className={styles.flexRight}>
              <Button
                type="primary"
                loading={loading.effects.taskboard.updateBoardNote}
                onClick={() => {
                  dispatch.taskboard.updateBoardNote({
                    boardId,
                    noteId,
                    title: noteTitle,
                    setEditOpen,
                  })
                }}>
                保存小记
              </Button>
              <Button
                onClick={() => {
                  setEditOpen(false)
                }}>
                取消
              </Button>
            </div>
          </Card>
        </Overlay>
      ) : popContent === 'delete' ? (
        // <Card active style={{ width: 500 }}>
        //   <strong style={{ fontSize: '18px' }}>删除小记</strong>
        //   <div style={{ marginTop: '10px' }}>你确定要删除这个小记？</div>
        //   <br />
        //   <div className={styles.flexRight}>
        //     <Button
        //       type="danger"
        //       loading={loading.effects.taskboard.deleteBoardNote}
        //       onClick={() => {
        //         dispatch.taskboard.deleteBoardNote({
        //           boardId,
        //           noteId,
        //           listId,
        //           setEditOpen,
        //         })
        //       }}>
        //       删除小记
        //     </Button>
        //   </div>
        // </Card>

        <Modal
          title="删除提示"
          isOpen={editOpen}
          confirmText="确定"
          cancelText="取消"
          icon="information"
          type="danger"
          onConfirm={() => {
            dispatch.taskboard.deleteBoardNote({
              boardId,
              noteId,
              listId,
              setEditOpen,
            })
          }}
          onCancel={() => setEditOpen(false)}
          onClosed={() => setEditOpen(false)}>
          <div>
            确定要删除这个小记？
            {/* 删除小记?
            <br />
            <strong>你确定要删除这个小记？!</strong> */}
          </div>
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default EditDrop
