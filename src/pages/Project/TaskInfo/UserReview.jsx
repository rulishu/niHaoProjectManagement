import { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Avatar, Button, Tooltip } from 'uiw'
import styles from './taskEvent.module.less'
import MarkdownPreview from '@uiw/react-markdown-preview'

const UserReview = (props) => {
  const { item, tier, editContent, showReview, setShowReview } = props

  const [isEdit, setIsEdit] = useState(false)
  // 1 : 回复 2 编辑
  // const [editOrReply, setEditOrReply] = useState(1)

  useEffect(() => {
    setIsEdit(showReview === item.taskHistoryId)
  }, [showReview, item])

  const nihao = () => {
    setIsEdit(true)
    setShowReview(item.taskHistoryId)
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
        <Avatar src="https://avatars2.githubusercontent.com/u/1680273?s=40&v=4" />
      </div>
      <div className={styles.eventLiContent}>
        <div className={styles.messageHeader}>
          <div className={styles.info}>{item.createName}</div>
          <div className={styles.actions}>
            {tier === 1 && (
              <Tooltip placement="top" content="回复">
                <Button icon="message" basic size="small" type="light" />
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
                onClick={() => nihao()}
              />
            </Tooltip>
          </div>
        </div>
        <div className={styles.messageContent}>
          {isEdit
            ? editContent(item.operatingRecords)
            : showMDBox(item.operatingRecords)}
        </div>
      </div>
    </div>
  )
}
export default UserReview
