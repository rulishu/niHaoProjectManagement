import { Card, List, Tooltip } from 'uiw'
import { useSelector } from 'react-redux'
import { navigate } from '@uiw-admin/router-control'
import { ProTable, useTable } from '@uiw-admin/components'
import moment from 'dayjs'

export default function AllTasks() {
  const {
    projectoverview: { projectMembersList, projectDynamicsList, projectId },
  } = useSelector((state) => state)

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
      title: '标题',
      key: 'milestonesTitle',
      ellipsis: true,
    },
    {
      title: '结束时间',
      key: 'dueTime',
      ellipsis: true,
      width: 120,
      render: (text) => {
        return <div>{text && moment(text).format('YYYY-MM-DD')}</div>
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
          <ProTable bordered={false} table={milepostTable} columns={columns} />
        </div>
      </Card>
      <Card
        title="最新动态"
        bordered={false}
        style={{ marginTop: 15, marginBottom: 15 }}>
        <div style={{ height: 437, overflowX: 'hidden', overflowY: 'auto' }}>
          <List
            size="small"
            noHover={true}
            bordered={false}
            dataSource={projectDynamicsList}
            renderItem={(item) => (
              <List.Item
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                <Tooltip placement="top" content={item.operatingRecords}>
                  {item.operatingRecords}
                </Tooltip>
              </List.Item>
            )}
          />
        </div>
      </Card>
      <Card title="项目成员" bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          {projectMembersList.map((e) => {
            return (
              <div
                style={{
                  width: 50,
                  textAlign: 'center',
                  marginRight: 10,
                  cursor: 'pointer',
                }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'pink',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => navigate(`/usersManagement/${projectId}`)}>
                  <span style={{ fontSize: 24 }}>{e.userName.slice(0, 1)}</span>
                </div>
                <span style={{ paddingTop: 5, display: 'block' }}>
                  {e.userName}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
