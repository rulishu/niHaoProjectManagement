import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Icon } from 'uiw'
import FromMD from './fromMD'
import UserReview from './UserReview'
import styles from './taskEvent.module.less'

const TaskEvent = () => {
  const dispatch = useDispatch()
  const {
    project: { commentData, taskInfoData },
    projectuser: { userSelectAllList },
  } = useSelector((state) => state)

  const [showReview, setShowReview] = useState(0)

  const updateData = (payload) => {
    console.log(payload)
    dispatch({
      type: 'project/update',
      payload,
    })
  }

  // 回复评论s板块
  const reviewBox = (item) => {
    return (
      <li key={item.taskHistoryId} className={styles.message}>
        <Card>
          <UserReview
            editContent={editContent}
            showReview={showReview}
            setShowReview={setShowReview}
            item={item}
            updateData={updateData}
          />
          {item.managerAssignmentHistorieList &&
          item.managerAssignmentHistorieList?.length ? (
            <div className={styles.replyManage}>
              {item.managerAssignmentHistorieList.map((itemA, index) => {
                return (
                  <Card key={index}>
                    <UserReview
                      item={itemA}
                      editContent={editContent}
                      showReview={showReview}
                      setShowReview={setShowReview}
                      updateData={updateData}
                      tier={2}
                    />
                  </Card>
                )
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
  const editContent = () => {
    return (
      <div className={styles.editContent}>
        <FromMD
          upDate={updateData}
          submit={() => dispatch.project.getAddComment({})}
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

  return (
    <div>
      <div className={styles.taskEventWrap}>
        <ul>
          {taskInfoData?.managerAssignmentHistories?.map((item) => {
            return item?.type === 2 ? reviewBox(item) : event(item)
          })}
        </ul>
      </div>
      {editContent()}
    </div>
  )
}
export default TaskEvent
