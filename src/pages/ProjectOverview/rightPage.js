import { Card, Steps, Avatar } from 'uiw'
import { useSelector } from 'react-redux'
import { navigate } from '@uiw-admin/router-control'
import { useParams } from 'react-router-dom'
import { ProTable, useTable } from '@uiw-admin/components'
import moment from 'dayjs'
import styles from './index.module.less'

export default function AllTasks() {
  const {
    projectoverview: { projectMembersList, projectDynamicsList },
  } = useSelector((state) => state)

  const { projectId } = useParams()
  const token = localStorage.getItem('token')
  const milepostTable = useTable('/api/project/projectCountById', {
    formatData: (data) => {
      return {
        data: data?.data?.milesWorkVoList || [],
      }
    },
    query: () => {
      return { projectId: projectId }
    },
    SWRConfiguration: {
      revalidateOnFocus: false,
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  const columns = [
    {
      title: '里程碑名称',
      key: 'milestonesTitle',
      ellipsis: true,
      width: 100,
    },
    {
      title: '结束时间',
      key: 'dueTime',
      ellipsis: true,
      width: 120,
      render: (text) => {
        return <div>{text ? moment(text).format('YYYY-MM-DD') : ''}</div>
      },
    },
    {
      title: '进度',
      key: 'rate',
      width: 80,
    },
  ]

  return (
    <div style={{ width: '30%' }}>
      <Card title="里程碑" bordered={false}>
        <div style={{ height: 331, overflowX: 'hidden', overflowY: 'auto' }}>
          <ProTable
            key="dueTime"
            onCell={(rowData) => {
              navigate(
                `/milestone/milestoneInfo/${projectId}/${rowData.milestonesId}`,
                {
                  state: { projectId, milestonesId: rowData.milestonesId },
                }
              )
            }}
            bordered={false}
            table={milepostTable}
            tableBackgroundColor="#fff"
            columns={columns}
            paginationProps={{ style: { display: 'none' } }}
          />
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
                  description={itm?.operatingRecords}></Steps.Step>
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
