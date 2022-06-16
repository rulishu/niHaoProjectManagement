import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, Input } from 'uiw'
import styles from './index.module.less'
import { CompDropdown } from '@/components'
import { initListData } from '@/utils/utils'

const Header = (props) => {
  const {
    selectBoard,
    setDeleteBoardCon,
    setSelectBoard,
    setCreatBut,
    setCreat,
    creatBut,
    loading,
  } = props.param
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const { taskboard } = useSelector((state) => state)
  const { boardList } = taskboard
  const [isOpen, setIsOpen] = useState(false) // 看板选择组件是否打开状态
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
                  children: <Input placeholder="请输入标题" />,
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
            setDeleteBoardCon(true)
          }}
          onChange={(e) => {
            setSelectBoard(e)
            setIsOpen(false)
            dispatch.taskboard.selectAllBoardNote({ boardId: e })
          }}
          onClickable={(is) => {
            setIsOpen(is)
          }}
          createTag={(icutData, nitData) => {
            dispatch.taskboard.saveBoard({
              name: nitData.boardTitle,
              projectId,
              setCreatBut,
              setIsOpen,
              setSelectBoard,
            })
            return true
          }}
        />
      </div>
      <Button
        type={creatBut ? 'light' : 'primary'}
        disabled={creatBut}
        onClick={() => {
          setCreat(true)
          setCreatBut(true)
        }}>
        创建列表
      </Button>
    </div>
  )
}

export default Header
