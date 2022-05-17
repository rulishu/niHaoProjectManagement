import { useEffect } from 'react'
import { Row, Col, Card, Steps, Tabs } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import styles from './index.less'
import { navigate } from '@uiw-admin/router-control'

export default function Home() {
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
                <Tabs.Pane
                  sequence="fadeIn up"
                  label="已关闭"
                  key="5"></Tabs.Pane>
                <Tabs.Pane
                  sequence="fadeIn up"
                  label="逾期完成"
                  key="6"></Tabs.Pane>
              </Tabs>
              <ProTable
                // bordered
                style={{ width: 900 }}
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
                  {
                    title: '创建时间',
                    key: 'gender2',
                  },
                ]}
              />
            </Card>
          </Col>
          <Col fixed style={{ width: '25%' }}>
            <Row>
              <Col>
                <Card title="最新动态" bordered={false} style={{ height: 220 }}>
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
                    </Steps>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card
                  title="项目成员"
                  bordered={false}
                  style={{ height: 200, marginTop: 10 }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {[
                      { name: '邢跃锋', key: 1 },
                      { name: '周政', key: 2 },
                      { name: '王翔', key: 3 },
                    ].map((e) => {
                      return (
                        <div
                          style={{
                            width: 50,
                            textAlign: 'center',
                            marginRight: 10,
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
                            onClick={() => navigate('/usersManagement')}>
                            <span style={{ fontSize: 24 }}>
                              {e.name.slice(0, 1)}
                            </span>
                          </div>
                          <span style={{ paddingTop: 5, display: 'block' }}>
                            {e.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}
