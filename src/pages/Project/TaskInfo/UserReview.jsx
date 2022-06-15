import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Avatar, Button, Tooltip } from 'uiw'
import FromMD from './fromMD'
import styles from './taskEvent.module.less'

const UserReview = (props) => {
  // const dispatch = useDispatch()
  const {
    projectuser: { userSelectAllList },
  } = useSelector((state) => state)
  const { item, tier = 1, showReview, setShowReview } = props

  const [isEdit, setIsEdit] = useState(false)
  // 1 : 回复 2 编辑
  const [editOrReply, setEditOrReply] = useState(1)

  // 判断是否是当前评论
  useEffect(() => {
    console.log(showReview === item?.taskHistoryId, item)
    setIsEdit(showReview === item?.taskHistoryId)
  }, [showReview, item])

  const strikeEditOrReply = (type) => {
    setIsEdit(true)
    setEditOrReply(type)
    setShowReview(item.taskHistoryId)
  }

  const subEditOrReply = (type) => {
    console.log('nihao', type)
  }

  // MD文档编译器
  const editContent = (editData, editName) => {
    console.log('editOrReply', editOrReply)
    return (
      <div className={styles.editContent}>
        <FromMD
          // upDate={updateData}
          submit={() => subEditOrReply()}
          editName={'commentData'}
          editData={editOrReply === 2 ? editData : ''}
          fromValue="operatingRecords"
          btnName="添加评论"
          tributeList={userSelectAllList}
          isComment={true}
        />
      </div>
    )
  }

  // 显示MD文档
  const showMDBox = (data) => {
    return (
      <div data-color-mode="light" style={{ flex: 1 }}>
        <MarkdownPreview source={data || ''} style={{ width: '100%' }} />
      </div>
    )
  }

  return (
    <div className={styles.eventLiBox} key={item.taskHistoryId}>
      <div className={styles.eventLiIcon}>
        <Avatar
          src={item?.avatar ? `/api/file/selectFile/${item?.avatar}` : ''}>
          {item?.nickName && item?.nickName[0]}
        </Avatar>
      </div>
      <div className={styles.eventLiContent}>
        <div className={styles.messageHeader}>
          <div className={styles.info}>{item.createName}</div>
          <div className={styles.actions}>
            {tier === 1 && (
              <Tooltip placement="top" content="回复">
                <Button
                  icon="message"
                  basic
                  size="small"
                  type="light"
                  onClick={() => strikeEditOrReply(1)}
                />
              </Tooltip>
            )}
            <Tooltip placement="top" content="删除">
              <Button icon="delete" basic size="small" type="light" />
            </Tooltip>
            <Tooltip placement="top" content="编辑">
              <Button
                icon="edit"
                basic
                size="small"
                type="light"
                onClick={() => strikeEditOrReply(2)}
              />
            </Tooltip>
          </div>
        </div>
        <div className={styles.messageContent}>
          {isEdit
            ? editContent(item, 'operatingRecords')
            : showMDBox(item.operatingRecords)}
        </div>
      </div>
    </div>
  )
}
export default UserReview
