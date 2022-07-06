import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Avatar } from 'uiw'
import FromMD from './fromMD'
import UserReview from './UserReview'
import styles from './taskEvent.module.less'
import { convertToString } from '@/utils/utils'
import LinkText from '@/components/LinkText'
import { Label } from '@/components'

const TaskEvent = () => {
  const dispatch = useDispatch()
  const {
    projectTasks: { taskInfoData, commentData },
    projectuser: { userSelectAllList },
  } = useSelector((state) => state)

  const [showReview, setShowReview] = useState(0)

  const updateData = (payload) => {
    dispatch({ type: 'projectTasks/update', payload })
  }

  // 添加评论
  const addTaskComments = () => {
    dispatch({
      type: 'projectTasks/addTaskComment',
      payload: {
        params: {
          operatingRecords: commentData.operatingRecords,
          assignmentId: taskInfoData.assignmentId,
          projectId: taskInfoData.projectId,
        },
        isType: 2,
      },
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

  //标签
  const labelBox = (items, value = []) => {
    return items?.map((item) => {
      return (
        <Label color={item.color} key={item?.id}>
          {item.name}
        </Label>
      )
    })
  }
  const dynamic = (item) => {
    //动态
    return {
      1: (
        <>
          <LinkText link={`${item?.projectUrl}`}>
            【{item?.projectName}】{' '}
          </LinkText>
        </>
      ),
      2: (
        <>
          <span> #{item.assignmentId}</span>
        </>
      ),
      3: (
        <>
          <span> #{item.assignmentId}</span>指派给了
          <LinkText
            color="gray"
            link={`/${item.assignmentUserName}`}
            value={`@${item.assignmentUserName}`}
          />
        </>
      ),
      4: (
        <>
          <span> #{item.assignmentId}</span>指派人取消了
        </>
      ),
      5: (
        <>
          <LinkText
            link={`/${item.userName}/${item.projectId}/milestone/milestoneInfo/${item.milestonesId}`}
            value={`${item.milestonesTitle}`}
          />
        </>
      ),
      6: (
        <>
          {/* <LinkText
            link={`/${item.userName}/${item.projectId}/milestone/milestoneInfo/${item.milestonesId}`}
            value={`${item.milestonesTitle}`}
          /> */}
        </>
      ),
      7: <>{/* {item.dueDate} */}</>,
      8: <>截止日期移除了</>,
      9: (
        <>
          <span className={styles.labelBox}>{labelBox(item?.labelsInfo)}</span>
          标签
        </>
      ),
      10: <>标签</>,
      12: <>时间逾期了</>,
      13: (
        <>
          <span> #{item.assignmentId}</span>
        </>
      ),
      14: (
        <>
          <span> #{item.assignmentId}</span>
        </>
      ),
      15: <></>,
      16: <></>,
    }
  }
  // 动态事件
  const event = (item) => {
    // return (
    //   <li key={item.taskHistoryId}>
    //     <div className={styles.eventLiBox}>
    //       <div className={styles.eventLiIcon}>
    //         <Icon type="user" />
    //       </div>
    //       <div className={styles.eventLiContent}>
    //         {item.historyType === 1 ? (
    //           <span>
    //             <LinkText link={`/${item?.userName}`}>{item.nickName}</LinkText>
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <LinkText link={`${item?.projectUrl}`}>
    //               【{item?.projectName}】
    //             </LinkText>
    //           </span>
    //         ) : item.historyType === 2 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <span> #{item.assignmentId}</span>
    //           </span>
    //         ) : item.historyType === 3 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <span> #{item.assignmentId}</span>
    //             指派给了
    //             <LinkText
    //               color="gray"
    //               link={`/${item.userName}`}
    //               value={`@${item.assignmentUserName}`}
    //             />
    //           </span>
    //         ) : item.historyType === 4 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <span> #{item.assignmentId}</span>
    //             指派人取消了
    //           </span>
    //         ) : item.historyType === 5 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <LinkText
    //               link={`/${item.userName}/${item.projectId}/milestone/milestoneInfo/${item.milestonesId}`}
    //               value={`${item.milestonesTitle}`}
    //             />
    //           </span>
    //         ) : item.historyType === 6 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <LinkText
    //               link={`/${item.userName}/${item.projectId}/milestone/milestoneInfo/${item.milestonesId}`}
    //               value={`${item.milestonesTitle}`}
    //             />
    //           </span>
    //         ) : item.historyType === 7 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             {/* {item.dueDate} */}
    //           </span>
    //         ) : item.historyType === 8 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             截止日期移除了
    //           </span>
    //         ) : item.historyType === 9 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <span className={styles.labelBox}>
    //               {labelBox(item?.labelsInfo)}
    //             </span>
    //             标签
    //           </span>
    //         ) : item.historyType === 10 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             标签
    //           </span>
    //         ) : item.historyType === 11 ? (
    //           <span></span>
    //         ) : item.historyType === 12 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             时间逾期了
    //           </span>
    //         ) : item.historyType === 13 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <span> #{item.assignmentId}</span>
    //           </span>
    //         ) : item.historyType === 14 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //             <span> #{item.assignmentId}</span>
    //           </span>
    //         ) : item.historyType === 15 || item.historyType === 16 ? (
    //           <span>
    //             <LinkText link={`/${item.userName}`} value={item.nickName} />
    //             <LinkText
    //               className={styles.mouseList}
    //               color="gray"
    //               link={`/${item?.userName}`}>
    //               @{item?.userName}
    //             </LinkText>
    //             {convertToString(item?.operatingRecords)}
    //           </span>
    //         ) : (
    //           ''
    //         )}
    //       </div>
    //     </div>
    //   </li>
    // )
    return (
      <li key={item.taskHistoryId}>
        <div className={styles.eventLiBox}>
          <div className={styles.eventLiIcon}>
            {/* <Icon type="user" /> */}
            <Avatar
              src={item?.avatar ? `/api/file/selectFile/${item?.avatar}` : ''}>
              {item?.nickName && item?.nickName[0]}
            </Avatar>
          </div>
          <div className={styles.eventLiContent}>
            {item.historyType === 11 ? (
              <span></span>
            ) : (
              <span>
                <LinkText link={`/${item?.userName}`}>{item.nickName}</LinkText>
                <LinkText
                  className={styles.mouseList}
                  color="gray"
                  link={`/${item?.userName}`}>
                  @{item?.userName}
                </LinkText>
                {convertToString(item?.operatingRecords)}
                {dynamic(item)[item.historyType]}
              </span>
            )}
          </div>
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
          submit={() => addTaskComments()}
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
  // console.log(taskInfoData?.managerAssignmentHistories);
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
