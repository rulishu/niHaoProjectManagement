// import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Icon, Avatar, Button, Tooltip } from 'uiw'
import MarkdownPreview from '@uiw/react-markdown-preview'
import FromMD from './fromMD'
import styles from './taskEvent.module.less'

const TaskEvent = (props) => {
  const dispatch = useDispatch()
  const {
    project: {
      commentData,
      // editCommentData,
      // editState,
      // replyConState,
      // replyConData,
      // replyState,
      // replyCommentData,
      taskInfoData,
    },
    projectuser: { userSelectAllList },
  } = useSelector((state) => state)
  // const [alertShow, setAlertShow] = useState(false)
  // const [editParameter, setEditParameter] = useState({})
  // const userId = JSON.parse(localStorage.getItem('userData'))?.userId
  // const stepIcon = {
  //   width: 30,
  //   height: 30,
  //   borderWidth: 1,
  //   borderStyle: 'solid',
  //   borderColor: '#ccc',
  //   borderRadius: 15,
  //   padding: 5,
  //   paddingTop: 0,
  // }
  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }
  const addComment = () => {
    dispatch.project.getAddComment()
  }
  // //编辑评论 回复
  // const goSaveComment = (type) => {
  //   const newOperatingRecords =
  //     type === 'comment'
  //       ? editCommentData.operatingRecords
  //       : replyConData.operatingRecords
  //   dispatch.project.getEditComment({
  //     ...editParameter,
  //     operatingRecords: newOperatingRecords,
  //   })
  // }
  // //回复评论
  // const goReplyComment = () => {
  //   dispatch.project.getAddComment({
  //     operatingRecords: replyCommentData.operatingRecords,
  //     parentId: replyCommentData.taskHistoryId,
  //     projectId: replyCommentData.projectId,
  //   })
  // }

  // const handleComment = (detail, item) => {
  //   setEditParameter(
  //     detail === 'del' || detail === 'delSub'
  //       ? {
  //         id: item.taskHistoryId,
  //         projectId: item.projectId,
  //       }
  //       : {
  //         taskHistoryId: item.taskHistoryId,
  //         projectId: item.projectId,
  //       }
  //   )
  //   if (detail === 'del' || detail === 'delSub') {
  //     setAlertShow(true)
  //   } else if (detail === 'edit') {
  //     updateData({
  //       editCommentData: item,
  //       editState: true,
  //     })
  //   } else if (detail === 'editSub') {
  //     updateData({
  //       replyConData: item,
  //       replyConState: true,
  //     })
  //   } else if (detail === 'close') {
  //     updateData({
  //       editState: false,
  //     })
  //   }
  //   if (detail === 'reply') {
  //     updateData({
  //       replyCommentData: { ...item, operatingRecords: '' },
  //       replyState: true,
  //     })
  //   } else if (detail === 'closeReply') {
  //     updateData({
  //       replyState: false,
  //     })
  //   }
  //   if (detail === 'cancelSub') {
  //     updateData({
  //       replyConState: false,
  //     })
  //   }
  // }

  const replyBox = (item, tier = 1) => {
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
                <Button icon="edit" basic size="small" type="light" />
              </Tooltip>
            </div>
          </div>
          <div className={styles.messageContent}>
            {showMDBox(item.operatingRecords)}
            {/* {editContent(item.operatingRecords)} */}
          </div>
        </div>
      </div>
    )
  }

  // 回复评论
  const reviewBox = (item) => {
    return (
      <li key={item.taskHistoryId} className={styles.message}>
        <Card>
          {replyBox(item)}
          {item.managerAssignmentHistorieList &&
          item.managerAssignmentHistorieList?.length ? (
            <div className={styles.replyManage}>
              <div className=""></div>
              {item.managerAssignmentHistorieList.map((itemA) => {
                return <Card>{replyBox(itemA, 2)}</Card>
              })}
            </div>
          ) : null}
        </Card>
      </li>
    )
  }

  // 动态事件
  const event = (item) => {
    return (
      <li key={item.taskHistoryId}>
        <div className={styles.eventLiBox}>
          <div className={styles.eventLiIcon}>
            <Icon type="user" />
          </div>
          <div className={styles.eventLiContent}>{item.operatingRecords}</div>
        </div>
      </li>
    )
  }

  // MD文档编译器
  const editContent = (type) => {
    return (
      <div className={styles.editContent}>
        <FromMD
          upDate={updateData}
          submit={addComment}
          editName="commentData"
          editData={commentData}
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
    <div>
      <div className={styles.taskEventWrap}>
        <ul>
          {taskInfoData?.managerAssignmentHistories?.map((item, index) => {
            return item?.type === 2 ? reviewBox(item) : event(item)
          })}
        </ul>
      </div>
      {editContent()}
    </div>
  )
}
export default TaskEvent
