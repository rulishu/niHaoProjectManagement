import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, Input, Overlay, Card, Checkbox } from 'uiw'
import styles from './index.module.less'
import { CompDropdown } from '@/components'
import { initListData } from '@/utils/utils'

const Header = (props) => {
  const { selectBoard, setDeleteBoardCon, setSelectBoard, loading } =
    props.param
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const { taskboard } = useSelector((state) => state)
  const { boardList, createBut, openTaskList, closeTaskList } = taskboard
  const [isOpen, setIsOpen] = useState(false) // 看板选择组件是否打开状态
  const [isEditBoard, setIsEditBoard] = useState(false) // 编辑看板状态
  const [editBoardName, setEditBoardName] = useState('') // 编辑看板input值

  useEffect(() => {
    setEditBoardName(
      boardList?.filter((item) => item?.id === selectBoard)[0]?.name
    )
  }, [boardList, selectBoard])

  const editBoard = () => {
    //保存按钮
    dispatch.taskboard.editBoard({
      setIsEditBoard,
      id: selectBoard,
      name: editBoardName,
      projectId,
      setSelectBoard,
    })
  }

  return (
    <div className={styles.header}>
      <div style={{ width: '200px' }}>
        <CompDropdown
          listData={initListData(boardList, selectBoard, 'id', {
            title: 'name',
          })}
          title="看板"
          isGonnaHitDeselect={false}
          isAllowsForNo={false}
          isOpen={isOpen}
          isRadio={true}
          dropdownWindow={{ isClickOutside: true }}
          labelHeader={[
            {
              title: '标题',
              dataIndex: 'title',
              resultsShow: true,
              isSearch: true,
              component: (item) => {
                return <span>{item?.title}</span>
              },
            },
          ]}
          actionButtons={{
            manage: { title: '删除看板' },
            create: { title: '创建看板' },
          }}
          loading={loading.effects.taskboard.saveBoard}
          form={{
            fields: (props) => {
              return {
                boardTitle: {
                  inline: true,
                  required: true,
                  children: (
                    <Input
                      placeholder="请输入标题"
                      style={{ width: '90%', lineHeight: '40px' }}
                    />
                  ),
                },
              }
            },
            fieldsShow: ({ fields, state, canSubmit, resetForm }) => {
              return (
                <>
                  {' '}
                  <div>{fields.boardTitle}</div>{' '}
                </>
              )
            },
            verify: (initial, current) => {
              const errorObj = {}
              const { boardTitle } = current
              if (
                !boardTitle ||
                boardTitle?.length < 2 ||
                boardTitle?.length > 100
              ) {
                errorObj.boardTitle = '请输入标题,长度为2~100'
              }
              return errorObj
            },
          }}
          template="milepost"
          shape="input"
          runLabel={() => {
            setIsOpen(false)
            dispatch.taskboard.update({
              create: false,
            })
            setDeleteBoardCon(true)
          }}
          onChange={(e) => {
            setSelectBoard(e)
            setIsOpen(false)
            dispatch.taskboard.selectAllBoardNote({ boardId: e })
          }}
          onClickLabelShow={(is) => {
            setIsOpen(is)
          }}
          createTag={(icutData, nitData) => {
            dispatch.taskboard.update({
              create: false,
            })
            dispatch.taskboard.saveBoard({
              name: nitData.boardTitle,
              projectId,
              setIsOpen,
              setSelectBoard,
            })
            return true
          }}
        />
      </div>
      <div>
        <Button
          disabled={createBut}
          onClick={() => {
            setIsEditBoard(!isEditBoard)
          }}>
          编辑看板
        </Button>
        <Button
          type={createBut ? 'light' : 'primary'}
          disabled={createBut}
          onClick={() => {
            dispatch.taskboard.update({
              create: true,
            })
            dispatch.taskboard.update({
              createBut: true,
            })
          }}>
          创建列表
        </Button>
      </div>
      <Overlay isOpen={isEditBoard} onClose={() => setIsEditBoard(false)}>
        <Card title={'编辑看板'} active style={{ width: 500 }}>
          <div className={styles.editBoardForm}>
            <strong style={{ margin: 0 }}>看板名称</strong>
            <div style={{ marginTop: '10px' }}>
              <Input
                value={editBoardName}
                onInput={(e) => {
                  setEditBoardName(e.target.value)
                }}
              />
            </div>
          </div>
          <div className={styles.editBoardForm}>
            <strong style={{ margin: 0 }}>看板选项</strong>
            <div style={{ margin: '5px', color: '#5e5e5e' }}>
              设置看板中是否显示默认列表
            </div>
            <div>
              <div>
                <Checkbox
                  checked={openTaskList}
                  onChange={(e) => {
                    dispatch.taskboard.update({
                      openTaskList: e.target.checked,
                    })
                  }}>
                  显示打开任务列表
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={closeTaskList}
                  onChange={(e) => {
                    dispatch.taskboard.update({
                      closeTaskList: e.target.checked,
                    })
                  }}>
                  显示关闭任务列表
                </Checkbox>
              </div>
            </div>
          </div>
          <div className={styles.flexRight} style={{ marginTop: '10px' }}>
            <Button
              loading={loading.effects.taskboard.editBoard}
              type="primary"
              onClick={() => {
                editBoard()
              }}>
              保存看板
            </Button>
          </div>
        </Card>
      </Overlay>
    </div>
  )
}

export default Header
