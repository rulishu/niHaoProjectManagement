import { Card, Steps, Avatar, Empty, Row, Col } from 'uiw'
import { useSelector } from 'react-redux'
import { navigate } from '@uiw-admin/router-control'
// import { useParams } from 'react-router-dom'
import styles from './index.module.less'
import dayjs from 'dayjs'

export default function AllTasks() {
  const {
    projectoverview: { projectMembersList, projectDynamicsList, allDataSource },
  } = useSelector((state) => state)
  // const { userAccount } = useParams()
  const allDataSources = allDataSource?.milesWorkVoList

  // 跳转里程碑详情
  const goMilestones = (milestonesId) => {
    allDataSource?.projectUrl &&
      navigate(
        `${allDataSource?.projectUrl}/milestone/milestoneInfo/${milestonesId}`
      )
  }
  const Blank = ({ num, height, width, style, background }) => (
    <div
      style={{
        ...style,
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        background,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width,
        height,
      }}>
      {num}
    </div>
  )

  //项目成员-路由跳转
  const goRouter = (item) => {
    navigate(`/${item}`)
  }

  return (
    <div style={{ width: '30%' }}>
      <Card title="里程碑" bordered={false} style={{ minWidth: 300 }}>
        <div className={styles.milestoneInfoList}>
          <ul>
            <Row className={styles.milInfoLiHead} style={{ marginTop: 5 }}>
              <Col>
                <Blank num={'里程碑名称'} />
              </Col>
              <Col grow={2}>
                <Blank num={'结束时间'} />
              </Col>
              <Col grow={5}>
                <Blank num={'显示进度'} />
              </Col>
            </Row>
            {allDataSources?.length === 0 ? (
              <Empty description={false} style={{ marginTop: 20 }} />
            ) : (
              allDataSources?.map((item) => {
                return (
                  <li
                    key={item?.milestonesId}
                    onClick={() => goMilestones(item?.milestonesId)}>
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
        <div style={{ height: 393, overflowX: 'hidden', overflowY: 'auto' }}>
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
      <Card
        title="项目成员"
        bordered={false}
        style={{ height: 460, overflowX: 'hidden', overflowY: 'auto' }}>
        <div className={styles.memberBox}>
          {projectMembersList.map((item, idx) => {
            return (
              <div key={idx} className={styles.memberItem}>
                <div
                  className={styles.memberItemLi}
                  onClick={() => goRouter(item?.userName)}>
                  <Avatar
                    size="large"
                    src={
                      item.avatar?.substring(0, 4) === 'http'
                        ? item.avatar
                        : item.avatar?.substring(0, 4) !== 'http' &&
                          item.avatar !== ''
                        ? `/api/file/selectFile/${item.avatar}`
                        : ''
                    }>
                    {item?.nickName && item?.nickName[0]}
                  </Avatar>
                </div>
                <span
                  className={styles.memberName}
                  onClick={() => goRouter(item?.userName)}>
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
