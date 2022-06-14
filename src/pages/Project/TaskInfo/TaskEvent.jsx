import { useSelector } from 'react-redux'
import { Steps, Icon } from 'uiw'
import styles from './index.module.less'

const TaskEvent = (props) => {
  const {
    project: { taskInfoData },
  } = useSelector((state) => state)
  const review = (item) => {
    return (
      <Steps.Step
        description="回复"
        icon={<Icon type="message" />}
        key={item.taskHistoryId}
        className={styles.nihao}
      />
    )
  }
  return (
    <div>
      <div className={styles.stepsBox}>
        <Steps current={1} direction="vertical" style={{ padding: '20px 0' }}>
          {/* {review()} */}
          {taskInfoData?.managerAssignmentHistories?.map((item, index) => {
            if (item.type === 2) {
              return review(item)
            }
            return (
              <Steps.Step
                description={item.operatingRecords}
                key={item.taskHistoryId}
                icon={<Icon type="edit" />}
              />
            )
          })}
        </Steps>
      </div>
    </div>
  )
}
export default TaskEvent
