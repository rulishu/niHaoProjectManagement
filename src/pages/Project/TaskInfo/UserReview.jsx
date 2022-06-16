import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Avatar, Button, Tooltip, Alert } from 'uiw'
import FromMD from './fromMD'
import styles from './taskEvent.module.less'

const UserReview = (props) => {
  const dispatch = useDispatch()
  const {
    project: { editCommentData, replyConData },
    projectuser: { userSelectAllList },
  } = useSelector((state) => state)
  const curUser = JSON.parse(localStorage.getItem('userData'))

  const { item, tier = 1, showReview, setShowReview, updateData } = props

  // 编辑组件是否打开
  const [isEdit, setIsEdit] = useState(false)

  // 删除评论弹窗
  const [alertShow, setAlertShow] = useState(false)

  // 1 : 回复 2 编辑
  const [editOrReply, setEditOrReply] = useState(1)

  // 1 : 回复 2 编辑
  const [isCurUser, setIsCurUser] = useState(false)

  // 判断是否是当前评论
  useEffect(() => {
    setIsCurUser(curUser.admin || curUser?.userId === item?.createId)
  }, [curUser.admin, curUser?.userId, item?.createId])

  // 判断是否是当前评论
  useEffect(() => {
    setIsEdit(showReview === item?.taskHistoryId)
  }, [showReview, item])

  // 点击回复与评论回调函数
  const strikeEditOrReply = (type) => {
    setIsEdit(!isEdit)
    setEditOrReply(type)
    setShowReview(item.taskHistoryId)
  }

  // 编辑或回复评论
  const subEditOrReply = () => {
    const callback = () => {
      setShowReview(0)
      setIsEdit(false)
    }
    const action =
      editOrReply === 1
        ? 'project/getAddComment'
        : editOrReply === 2
        ? 'project/getEditComment'
        : ''
    const params =
      editOrReply === 1
        ? {
            operatingRecords: replyConData.operatingRecords,
            parentId: item.taskHistoryId,
            projectId: item.projectId,
          }
        : editOrReply === 2
        ? {
            ...editCommentData,
            operatingRecords: editCommentData.operatingRecords,
          }
        : {}
    dispatch({
      type: action,
      payload: { params, callback },
    })
  }

  // MD文档编译器
  const editContentBox = (editData, editType) => {
    return (
      <div className={styles.editContent}>
        <FromMD
          upDate={updateData}
          submit={subEditOrReply}
          editName={
            editOrReply === 1
              ? 'replyConData'
              : editOrReply === 2
              ? 'editCommentData'
              : 'commentData'
          }
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
            {tier === 1 && !(editOrReply === 2 && isEdit) && (
              <Tooltip placement="top" content="回复">
                <Button
                  icon="message"
                  basic
                  size="small"
                  type="light"
                  onClick={() => strikeEditOrReply(1, '')}
                />
              </Tooltip>
            )}
            {isCurUser && (
              <Tooltip placement="top" content="删除">
                <Button
                  icon="delete"
                  basic
                  size="small"
                  type="light"
                  onClick={() => setAlertShow(2)}
                />
              </Tooltip>
            )}
            {isCurUser && !(editOrReply === 1 && isEdit) && (
              <Tooltip placement="top" content="编辑">
                <Button
                  icon="edit"
                  basic
                  size="small"
                  type="light"
                  onClick={() => strikeEditOrReply(2, item.operatingRecords)}
                />
              </Tooltip>
            )}
          </div>
        </div>
        <div className={styles.messageContent}>
          {(editOrReply !== 2 || !isEdit) && showMDBox(item.operatingRecords)}
          {isEdit && editContentBox(item, editOrReply)}
        </div>
      </div>
      <Alert
        isOpen={alertShow}
        confirmText="确认"
        onClosed={() => setAlertShow(false)}
        type="danger"
        content={`是否确认删除本条评论！`}
        onConfirm={() => {
          dispatch.project.delCommentById(item)
        }}></Alert>
    </div>
  )
}
export default UserReview
