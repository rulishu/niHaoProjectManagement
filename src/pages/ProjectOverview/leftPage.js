import { useState } from 'react'
import { Row, Col, Card, List, Tabs, Tag, Button, Progress, Icon } from 'uiw'
import { useSelector } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import { useNavigate } from 'react-router-dom'
import styles from './index.less'

export default function Home() {
  const {
    projectoverview: { allDataSource, projectId, pageSize },
  } = useSelector((state) => state)
  const navigate = useNavigate()
  const [allTab, setAllTab] = useState('5')
  const [myTab, setMyTab] = useState('5')

  const token = localStorage.getItem('token')

  const myTable = useTable('/api/ManagerAssignment/projectOverview', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.list || [],
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex) => {
      return {
        projectId: projectId,
        filterParam: myTab,
        myAssignment: true,
        page: pageIndex,
        pageSize: pageSize,
      }
    },
    // swr options
    SWRConfiguration: {
      revalidateOnFocus: false,
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  const table = useTable('/api/ManagerAssignment/projectOverview', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.list || [],
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, searchValues) => {
      return {
        projectId: projectId,
        filterParam: allTab,
        myAssignment: false,
        page: pageIndex,
        pageSize: pageSize,
      }
    },
    SWRConfiguration: {
      revalidateOnFocus: false,
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  function randomColor() {
    return (
      '#' +
      ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
    )
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Card
          style={{ width: '40%' }}
          title={allDataSource?.projectName}
          bordered={false}
          extra={
            <Button icon="setting-o" basic>
              修改项目资料
            </Button>
          }>
          <Col style={{ height: 330, overflowX: 'hidden', overflowY: 'auto' }}>
            <List bordered={false} noHover={true}>
              <List.Item>项目描述: {allDataSource.projectDesc}</List.Item>
              <List.Item>项目成员: 王某</List.Item>
              <List.Item>项目技术: TypeScript</List.Item>
            </List>
          </Col>
        </Card>
        <Card
          title={`我的项目 / ${allDataSource?.projectName || ''}`}
          bordered={false}
          style={{
            height: 400,
            width: '100%',
            marginLeft: 15,
            marginRight: 15,
          }}>
          <Row className={styles.colContent}>
            <Col
              style={{
                borderRight: '1px solid #EBF2FB',
                textAlign: 'center',
              }}>
              <Progress.Circle
                width={100}
                strokeWidth={10}
                percent={allDataSource?.totalWorkVo?.projectNum}
                format={(percent) => (
                  <span>
                    {`${percent}`}
                    <div style={{ padding: '10px 0 0 0', fontSize: 12 }}>
                      总任务
                    </div>
                  </span>
                )}
              />
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log('123')
                  }}>
                  查看全部<Icon type="right" size={12}></Icon>
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <div
                  style={{
                    marginTop: 20,
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                  }}>
                  {[
                    {
                      title: '未开始',
                      num: allDataSource?.totalWorkVo?.projectWksNum || 0,
                      key: 1,
                    },
                    {
                      title: '开发中',
                      num: allDataSource?.totalWorkVo?.projectKfzNum || 0,
                      key: 2,
                    },
                    {
                      title: '已完成',
                      num: allDataSource?.totalWorkVo?.projectYwcNum || 0,
                      key: 3,
                    },
                    {
                      title: '已关闭',
                      num: allDataSource?.totalWorkVo?.projectYwcNum || 0,
                      key: 4,
                    },
                    {
                      title: '已逾期',
                      num: allDataSource?.totalWorkVo?.projectYqsNum || 0,
                      key: 5,
                    },
                  ].map((item) => {
                    return (
                      <Card
                        bordered={false}
                        onClick={() => console.log('123')}
                        key={item.key}
                        title={item.title}
                        style={{ width: 80 }}>
                        <span style={{ fontSize: 36, color: randomColor() }}>
                          {item.num}
                        </span>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
      <Card
        title="我的任务"
        extra={'更多'}
        bodyStyle={{ paddingTop: 0 }}
        style={{ margin: '15px 15px 15px 0px' }}>
        <Tabs
          activeKey="5"
          style={{ marginBottom: 0 }}
          onTabClick={(tab) => {
            setMyTab(tab)
            myTable.onSearch()
          }}>
          <Tabs.Pane label="待处理" key="5" />
          <Tabs.Pane label="进行中" key="1" />
          <Tabs.Pane label="已逾期" key="2" />
          <Tabs.Pane label="我创建的" key="3" />
          <Tabs.Pane label="逾期完成" key="4" />
        </Tabs>
        <ProTable
          style={{ width: 900 }}
          table={myTable}
          onCell={(rowData) => {
            navigate(
              `/project/taskInfo/${rowData.projectId}/${rowData.assignmentId}`
            )
          }}
          columns={[
            {
              title: '任务标题',
              key: 'assignmentTitle',
              ellipsis: true,
              width: 100,
            },
            {
              title: '任务描述',
              key: 'description',
              ellipsis: true,
            },
            {
              title: '创建人',
              key: 'createName',
              width: 100,
              ellipsis: true,
            },
            {
              title: '任务状态',
              key: 'assignmentStatus',
              width: 100,
              render: (text) => {
                return (
                  <Tag
                    color={
                      text === 1
                        ? '#F95C2B'
                        : text === 2
                        ? '#008EF0'
                        : text === 3
                        ? '#28a745'
                        : '#dc3545'
                    }>
                    {text === 1
                      ? '未开始'
                      : text === 2
                      ? '#进行中'
                      : text === 3
                      ? '#已完成'
                      : '#已逾期'}
                  </Tag>
                )
              },
            },
            {
              title: '截止时间',
              key: 'finishTime',
              width: 180,
              ellipsis: true,
            },
            {
              title: '创建时间',
              key: 'createTime',
              width: 180,
              ellipsis: true,
            },
          ]}
        />
      </Card>
      <Card
        title="所有任务"
        extra={
          <Button
            basic
            type="dark"
            onClick={() => (window.location.href = '#/projectList')}>
            更多
          </Button>
        }
        style={{ marginRight: 15 }}
        bodyStyle={{ paddingTop: 0 }}>
        <Tabs
          activeKey="5"
          style={{ marginBottom: 0 }}
          onTabClick={(tab) => {
            setAllTab(tab)
            table.onSearch()
          }}>
          <Tabs.Pane label="待处理" key="5" />
          <Tabs.Pane label="进行中" key="1" />
          <Tabs.Pane label="已逾期" key="2" />
          <Tabs.Pane label="我创建的" key="3" />
          <Tabs.Pane label="逾期完成" key="4" />
        </Tabs>
        <ProTable
          style={{ width: 900 }}
          table={table}
          onCell={(rowData) => {
            navigate(
              `/project/taskInfo/${rowData.projectId}/${rowData.assignmentId}`
            )
          }}
          columns={[
            {
              title: '任务标题',
              key: 'assignmentTitle',
              ellipsis: true,
              width: 100,
            },
            {
              title: '任务描述',
              key: 'description',
              ellipsis: true,
            },
            {
              title: '创建人',
              key: 'createName',
              width: 100,
              ellipsis: true,
            },
            {
              title: '任务状态',
              key: 'assignmentStatus',
              width: 100,
              render: (text) => {
                return (
                  <Tag
                    color={
                      text === 1
                        ? '#F95C2B'
                        : text === 2
                        ? '#008EF0'
                        : text === 3
                        ? '#28a745'
                        : '#dc3545'
                    }>
                    {text === 1
                      ? '未开始'
                      : text === 2
                      ? '#进行中'
                      : text === 3
                      ? '#已完成'
                      : '#已逾期'}
                  </Tag>
                )
              },
            },
            {
              title: '截止时间',
              key: 'finishTime',
              width: 180,
              ellipsis: true,
            },
            {
              title: '创建时间',
              key: 'createTime',
              width: 180,
              ellipsis: true,
            },
          ]}
        />
      </Card>
    </div>
  )
}
