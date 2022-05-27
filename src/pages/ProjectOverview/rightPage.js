import { Card, Steps, Avatar, Empty } from 'uiw'
import { useSelector } from 'react-redux'
import { navigate } from '@uiw-admin/router-control'
import { useParams } from 'react-router-dom'
import styles from './index.module.less'
import dayjs from 'dayjs'

export default function AllTasks() {
  const {
    projectoverview: { projectMembersList, projectDynamicsList, allDataSource },
  } = useSelector((state) => state)

  const { projectId } = useParams()
  const allDataSources = allDataSource?.milesWorkVoList

  // 跳转里程碑详情
  const goMilestones = (_, milestonesId) => {
    window.location.href = `#/milestone/milestoneInfo/${projectId}/${milestonesId}`
  }
  return (
    <div style={{ width: '30%' }}>
      <Card title="里程碑" bordered={false} style={{ width: 300 }}>
        <div className={styles.milestoneInfoList}>
          <ul>
            <p className={styles.milInfoLiHead}>
              <samp style={{ flex: 4, marginLeft: 0 }}>里程碑名称</samp>
              <samp style={{ flex: 3, marginLeft: 32 }}>结束时间</samp>
              <samp style={{ flex: 2, marginLeft: 50 }}>进度</samp>
            </p>
            {allDataSources?.length === 0 ? (
              <Empty description={false} style={{ marginTop: 20 }} />
            ) : (
              allDataSources?.map((item) => {
                return (
                  <li
                    key={item?.milestonesId}
                    onClick={() =>
                      goMilestones(item?.projectId, item?.milestonesId)
                    }>
                    <span style={{ flex: 3 }}>{item?.milestonesTitle}</span>
                    <span style={{ flex: 4, fontSize: '12px' }}>
                      {item?.dueTime &&
                        dayjs(item?.dueTime).format('YYYY-MM-DD')}
                    </span>
                    <span style={{ flex: 2 }}>{item?.rate}</span>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </Card>
      <Card
        title="最新动态"
        bordered={false}
        style={{ marginTop: 15, marginBottom: 15 }}>
        <div style={{ height: 437, overflowX: 'hidden', overflowY: 'auto' }}>
          <Steps
            direction="vertical"
            progressDot
            status="error"
            current={projectDynamicsList?.length}
            style={{ padding: '20px 0' }}>
            {projectDynamicsList?.map((itm, key) => {
              return (
                <Steps.Step
                  title={itm?.createTime}
                  key={key}
                  onClick={() =>
                    (window.location.href = `#/project/taskInfo/${projectId}/${itm.assignmentId}`)
                  }
                  description={
                    <div className={styles.mouseList}>
                      {itm?.operatingRecords}
                    </div>
                  }></Steps.Step>
              )
            })}
          </Steps>
        </div>
      </Card>
      <Card title="项目成员" bordered={false}>
        <div className={styles.memberBox}>
          {projectMembersList.map((item, idx) => {
            return (
              <div key={idx} className={styles.memberItem}>
                <div
                  className={styles.memberItemLi}
                  onClick={() => navigate(`/userHome/${item?.userId}`)}>
                  <Avatar
                    size="large"
                    src={
                      item?.avatar ? `/api/file/selectFile/${item?.avatar}` : ''
                    }>
                    {item?.nickName && item?.nickName[0]}
                  </Avatar>
                </div>
                <span
                  className={styles.memberName}
                  onClick={() => navigate(`/userHome/${item?.userId}`)}>
                  {item?.nickName}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
