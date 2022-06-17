import { useState } from 'react'
import {
  Row,
  Col,
  Card,
  List,
  Tabs,
  Tag,
  Button,
  Progress,
  Tooltip,
  Empty,
} from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './index.module.less'
import ProjectManagement from '../../components/ProjectManagement'
import { NumColor } from '../../utils/utils'

export default function Home() {
  const {
    projectoverview: { allDataSource, pageSize },
  } = useSelector((state) => state)
  const { projectId, userAccount } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [allTab, setAllTab] = useState('5')
  const [myTab, setMyTab] = useState('5')
  const [myCreat, setMyCreat] = useState(true)
  const allDataSources = allDataSource?.milesWorkVoList
  const token = localStorage.getItem('token')

  const myTable = useTable('/api/ManagerAssignment/projectOverview', {
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.rows || [],
      }
    },
    query: (pageIndex) => {
      return {
        projectId: projectId,
        filterParam: Number(myTab),
        myAssignment: myCreat,
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

  const table = useTable('/api/ManagerAssignment/projectOverview', {
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.rows || [],
      }
    },
    query: (pageIndex, searchValues) => {
      return {
        projectId: projectId,
        filterParam: Number(allTab),
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

  //修改项目资料
  const reset = () => {
    dispatch({
      type: 'projectoverview/getProjectCountById', //统计
      payload: {
        projectId: projectId,
      },
    })
    dispatch({
      type: 'projectlist/queryProject',
      payload: { id: projectId },
    })
  }

  //表格

  const TableList = () => {
    return (
      <div
        style={{
          height: 355,
          overflowX: 'hidden',
          overflowY: 'auto',
        }}>
        {allDataSources?.length === 0 ? (
          <Empty description={false} style={{ marginTop: 30 }} />
        ) : (
          <ProTable
            className={styles.mouseList}
            style={{ width: 900 }}
            table={myTable}
            onCell={(rowData) => {
              navigate(
                `${rowData?.projectUrl}/task/taskInfo/${rowData.assignmentId}`
              )
            }}
            columns={[
              {
                title: '任务标题',
                key: 'assignmentTitle',
                ellipsis: true,
                width: 100,
                render: (address) => (
                  <Tooltip placement="topLeft" content={address}>
                    {address}
                  </Tooltip>
                ),
              },
              // {
              //   title: '任务描述',
              //   key: 'description',
              //   ellipsis: true,
              // },
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
                        ? '进行中'
                        : text === 3
                        ? '已完成'
                        : '已逾期'}
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
        )}
      </div>
    )
  }

  //表格
  const AllTableList = () => {
    return (
      <div
        style={{
          height: 355,
          overflowX: 'hidden',
          overflowY: 'auto',
        }}>
        <ProTable
          className={styles.mouseList}
          style={{ width: 900 }}
          table={table}
          onCell={(rowData) => {
            navigate(
              `${rowData?.projectUrl}/task/taskInfo/${rowData.assignmentId}`
            )
          }}
          columns={[
            {
              title: '任务标题',
              key: 'assignmentTitle',
              ellipsis: true,
              width: 100,
              render: (address) => (
                <Tooltip placement="topLeft" content={address}>
                  {address}
                </Tooltip>
              ),
            },
            // {
            //   title: '任务描述',
            //   key: 'description',
            //   ellipsis: true,
            // },
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
                      ? '进行中'
                      : text === 3
                      ? '已完成'
                      : '已逾期'}
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
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Card
          style={{ width: '40%' }}
          title={
            allDataSource?.projectStatus === 3
              ? '项目说明（已挂起）'
              : '项目说明'
          }
          bodyStyle={{ padding: 0 }}
          bordered={false}
          extra={
            <Button
              icon="setting-o"
              basic
              onClick={() => {
                dispatch({
                  type: 'projectUpdate/updataProject',
                  payload: { drawerType: 'edit', id: projectId },
                })
              }}>
              编辑
            </Button>
          }>
          <Col style={{ height: 330, overflowX: 'hidden', overflowY: 'auto' }}>
            <List bordered={false} noHover={true}>
              <List.Item className={styles.leftList}>
                <span className={styles.leftTitle}>项目负责人:</span>
                {allDataSource.projectLeader?.nickName +
                  allDataSource.projectLeader?.email || ''}
              </List.Item>
              <List.Item>
                <span className={styles.leftTitle}> 起始日期: </span>{' '}
                {allDataSource.begin || ''}
              </List.Item>
              <List.Item>
                <span className={styles.leftTitle}> 截止日期: </span>{' '}
                {allDataSource.end || ''}
              </List.Item>
              <List.Item>
                <div>
                  <div className={styles.leftTitle}>项目描述: </div>
                  <div className={styles.msList}>
                    {allDataSource.projectDesc || '暂无描述！'}
                  </div>
                </div>
              </List.Item>
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
            textAlign: 'center',
          }}>
          <Row className={styles.colContent}>
            <Col
              style={{
                textAlign: 'center',
              }}>
              <Progress.Circle
                width={100}
                strokeWidth={10}
                percent={
                  NumColor(
                    allDataSource?.totalWorkVo?.projectYwcNum,
                    allDataSource?.totalWorkVo?.projectNum
                  ) || 0
                }
                format={(percent) => (
                  <span>
                    {`${allDataSource?.totalWorkVo?.projectNum || 0}`}
                    <div style={{ padding: '10px 0 0 0', fontSize: 12 }}>
                      总任务
                    </div>
                  </span>
                )}
              />
              {/* <div>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log('123')
                  }}>
                  查看全部<Icon type="right" size={12}></Icon>
                </Button>
              </div> */}
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
                      title: '已逾期',
                      num: allDataSource?.totalWorkVo?.projectYqsNum || 0,
                      key: 5,
                    },
                  ].map((item) => {
                    return (
                      <Card
                        bordered={false}
                        key={item.key}
                        title={item.title}
                        // style={{ width: 80 }}
                      >
                        <span style={{ fontSize: 36 }}>{item.num}</span>
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
        // extra={'更多'}
        style={{ margin: '15px 15px 15px 0px' }}>
        <Tabs
          activeKey="5"
          onTabClick={(tab) => {
            setMyTab(tab)
            myTable.onSearch()
            tab === '3' ? setMyCreat(false) : setMyCreat(true) //‘我创建的’项目myAssignment字段为false
          }}>
          <Tabs.Pane label="待处理" key="5">
            {TableList()}
          </Tabs.Pane>
          <Tabs.Pane label="进行中" key="1">
            {TableList()}
          </Tabs.Pane>
          <Tabs.Pane label="已逾期" key="2">
            {TableList()}
          </Tabs.Pane>
          <Tabs.Pane label="我创建的" key="3">
            {TableList()}
          </Tabs.Pane>
          <Tabs.Pane label="逾期完成" key="4">
            {TableList()}
          </Tabs.Pane>
        </Tabs>
      </Card>
      <Card
        title="所有任务"
        extra={
          <Button
            basic
            type="dark"
            onClick={() =>
              (window.location.href = `#/${userAccount}/${projectId}/task`)
            }>
            更多
          </Button>
        }
        style={{ marginRight: 15 }}>
        <Tabs
          activeKey="5"
          onTabClick={(tab) => {
            setAllTab(tab)
            table.onSearch()
          }}>
          <Tabs.Pane label="待处理" key="5">
            {AllTableList()}
          </Tabs.Pane>
          <Tabs.Pane label="进行中" key="1">
            {AllTableList()}
          </Tabs.Pane>
          <Tabs.Pane label="已逾期" key="2">
            {AllTableList()}
          </Tabs.Pane>
          <Tabs.Pane label="逾期完成" key="4">
            {AllTableList()}
          </Tabs.Pane>
        </Tabs>
      </Card>
      <ProjectManagement fun={reset} />
    </div>
  )
}
