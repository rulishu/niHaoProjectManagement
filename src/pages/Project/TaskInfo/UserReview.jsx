import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Avatar, Button, Tooltip, Modal } from 'uiw'
import FromMD from './fromMD'
import styles from './taskEvent.module.less'
import timeDistance from '@/utils/timeDistance'
// import LinkText from '@/components/LinkText'

const UserReview = (props) => {
  const dispatch = useDispatch()
  const {
    projectuser: { userSelectAllList },
    projectTasks: { replyConData, taskInfoData, editCommentData },
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
    setIsCurUser(curUser?.admin || curUser?.userId === item?.createId)
  }, [curUser?.admin, curUser?.userId, item?.createId])

  // 判断是否是当前评论
  useEffect(() => {
    setIsEdit(showReview === item?.taskHistoryId)
  }, [showReview, item])

  // 点击回复与评论回调函数
  const strikeEditOrReply = (type, data) => {
    dispatch({
      type: 'projectTasks/update',
      payload: { editCommentData: { operatingRecords: data } },
    })
    setIsEdit(!isEdit)
    setEditOrReply(type)
    setShowReview(item?.taskHistoryId)
  }

  // 编辑或回复评论
  const subEditOrReply = () => {
    const { assignmentId, projectId, taskHistoryId } = item
    const callback = () => {
      setShowReview(0)
      setIsEdit(false)
    }
    const action =
      editOrReply === 1
        ? 'projectTasks/addTaskComment'
        : editOrReply === 2
        ? 'projectTasks/editTaskComment'
        : ''

    const params =
      editOrReply === 1
        ? {
            operatingRecords: replyConData.operatingRecords,
            parentId: taskHistoryId,
            projectId,
            assignmentId,
          }
        : editOrReply === 2
        ? {
            ...editCommentData,
            taskHistoryId,
            operatingRecords:
              editCommentData.operatingRecords || item?.operatingRecords,
          }
        : {}
    dispatch({
      type: action,
      payload: { params, callback, isType: 3 },
    })
  }

  // MD文档编译器
  const editContentBox = (editData, editType) => {
    const newEditData = editType === 1 ? replyConData : editCommentData
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
          editData={editType === 2 ? newEditData : ''}
          fromValue="operatingRecords"
          btnName={editOrReply === 1 ? '回复' : '保存'}
          tributeList={userSelectAllList}
          // isComment={true}
          isEdit={isEdit}
          onClose={() => setIsEdit(false)}
        />
      </div>
    )
  }

  // 显示MD文档
  const showMDBox = (data) => {
    // const datsas= userSelectAllList?.filter(function(item){
    //   return data?.includes(item?.memberName);
    // })
    return (
      <div data-color-mode="light" style={{ flex: 1 }}>
        <MarkdownPreview source={data || ''} style={{ width: '100%' }} />
      </div>
    )
  }

  return (
    <div className={styles.eventLiBox} key={item?.taskHistoryId}>
      <div className={styles.eventLiIcon}>
        <Avatar
          src={item?.avatar ? `/api/file/selectFile/${item?.avatar}` : ''}>
          {item?.nickName && item?.nickName[0]}
        </Avatar>
      </div>
      <div className={styles.eventLiContent}>
        <div className={styles.messageHeader}>
          <div className={styles.info}>
            {item?.nickName}
            {/* createName 变成实时更新的 nickName */}
            <span style={{ color: '#666' }}> @{item?.userName} </span>·{' '}
            <span style={{ color: '#666' }}>
              {timeDistance(item?.createTime).time}
              {timeDistance(item?.createTime).status ? '前' : '后'}{' '}
            </span>
          </div>
          <div className={styles.actions}>
            {item?.createName === taskInfoData?.createName &&
              !(editOrReply === 2 && isEdit) && (
                <Tooltip placement="top" content={'此用户是此问题的作者'}>
                  <span
                    className={styles.namebox}
                    style={{
                      backgroundColor: 'white',
                      color: '#666',
                    }}>
                    {'作者'}
                  </span>
                </Tooltip>
              )}
            {item?.memberRole && !(editOrReply === 2 && isEdit) && (
              <Tooltip
                placement="top"
                content={`此用户在管理项目中具有${
                  item?.memberRole === 1
                    ? '开发'
                    : item.memberRole === 2
                    ? '测试'
                    : '项目管理者'
                }角色`}>
                <span
                  className={styles.namebox}
                  style={{
                    backgroundColor: 'white',
                    color: '#666',
                  }}>
                  {item?.memberRole === 1
                    ? '开发'
                    : item?.memberRole === 2
                    ? '测试'
                    : '项目管理者'}
                </span>
              </Tooltip>
            )}
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
                  onClick={() => strikeEditOrReply(2, item?.operatingRecords)}
                />
              </Tooltip>
            )}
          </div>
        </div>
        <div className={styles.messageContent}>
          {(editOrReply !== 2 || !isEdit) && showMDBox(item?.operatingRecords)}
          {isEdit && editContentBox(item, editOrReply)}
        </div>
      </div>
      <Modal
        title="删除提示"
        isOpen={alertShow}
        confirmText="确定"
        cancelText="取消"
        icon="information"
        onClosed={() => setAlertShow(false)}
        type="danger"
        content={`是否确认删除本条评论！`}
        onConfirm={() => {
          dispatch.projectTasks.delTaskComment(item)
        }}></Modal>
    </div>
  )
}
export default UserReview
