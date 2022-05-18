import { useEffect } from 'react'
import { Row, Col, Card, Steps, Tabs } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import styles from './index.less'

export default function SlelectLabel() {
  const dispatch = useDispatch()
  const {
    home: { taskId },
  } = useSelector((state) => state)

  useEffect(() => {
    dispatch({
      type: 'home/queryProject',
      payload: { record: taskId },
    })
    dispatch({
      type: 'home/selectOperatingRecord',
      payload: taskId,
    })
  }, [taskId, dispatch])
  const table = useTable('https://randomuser.me/api', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: 100,
        data: data.results,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        results: pageSize,
        ...searchValues,
      }
    },
    requestOptions: { method: 'GET' },
  })

  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: '75%' }}>
            <Card title="我的任务" extra={'更多'} bodyStyle={{ paddingTop: 0 }}>
              <Tabs
                // type="line"
                activeKey="1"
                style={{ marginBottom: 0 }}
                onTabClick={(tab, key, e) => {
                  console.log('=>', key, tab)
                }}>
                <Tabs.Pane label="待处理" key="1"></Tabs.Pane>
                <Tabs.Pane label="进行中" key="2"></Tabs.Pane>
                <Tabs.Pane
                  sequence="fadeIn up"
                  label="已逾期"
                  key="3"></Tabs.Pane>
                <Tabs.Pane label="我创建的" key="4"></Tabs.Pane>
              </Tabs>
              <ProTable
                paginationProps={{
                  pageSizeOptions: [10, 20, 30],
                  pageSize: 10,
                }}
                table={table}
                columns={[
                  {
                    title: '项目',
                    key: 'name',
                    render: (text) => {
                      return (
                        <div>
                          {text.title}.{text.first}
                          {text.last}
                        </div>
                      )
                    },
                  },
                  {
                    title: '任务名称',
                    key: 'registered',
                    render: (text) => {
                      return <div>{text.age}</div>
                    },
                  },
                  {
                    title: '任务状态',
                    key: 'registered',
                    render: (text) => {
                      return <div>{text.age}</div>
                    },
                  },
                  {
                    title: '创建人',
                    key: 'phone',
                  },
                  {
                    title: '任务状态',
                    key: 'gender',
                  },
                  {
                    title: '截止时间',
                    key: 'gender1',
                  },
                ]}
              />
            </Card>
          </Col>
          <Col fixed style={{ width: '25%' }}>
            <Card title="成员动态" bordered={false} style={{ height: 440 }}>
              <div className={styles.newDynamic}>
                <Steps
                  direction="vertical"
                  progressDot
                  status="error"
                  current={2}
                  style={{ padding: '20px 0' }}>
                  <Steps.Step
                    title="步骤一"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                  <Steps.Step
                    title="步骤二"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                  <Steps.Step
                    title="步骤三"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                  <Steps.Step
                    title="步骤四"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                  <Steps.Step
                    title="步骤五"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                  <Steps.Step
                    title="步骤六"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                </Steps>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
