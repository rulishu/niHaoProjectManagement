import { useEffect, useState } from 'react'
import { Row, Col, Card, Tabs, Steps, Tag, Tooltip, Empty } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { convertToString } from '@/utils/utils'
import LinkText from '@/components/LinkText'
import { Label } from '@/components'

export default function SlelectLabel() {
  const dispatch = useDispatch()
  const {
    workbench: { memberList },
  } = useSelector((state) => state)
  const navigate = useNavigate()
  const [tab, setTab] = useState(1)
  const [newMemberList, setNewMemberList] = useState([])
  useEffect(() => {
    setNewMemberList(memberList.slice(0, 10))
  }, [memberList])

  useEffect(() => {
    dispatch({
      type: 'workbench/memberOperator',
    })
  }, [dispatch])
  const token = localStorage.getItem('token')
  const table = useTable('/api/workbench/selectProjectPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        assignmentStatus: tab !== '5' ? Number(tab) : '',
        createId: tab === '5' ? 1 : '',
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  const divscrollFn = (event) => {
    let el = event.target
    if (el.scrollTop + el.clientHeight + 2 >= el.scrollHeight) {
      if (newMemberList.length !== memberList.length) {
        setNewMemberList([
          ...newMemberList,
          ...memberList.slice(newMemberList.length, newMemberList.length + 10),
        ])
      }
    }
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

  const TableList = () => {
    return (
      <div
        className={styles.oncell}
        style={{
          height: 355,
          overflowX: 'hidden',
          overflowY: 'auto',
        }}>
        <ProTable
          paginationProps={{ style: { display: 'none' } }}
          onCell={(rowData) => {
            navigate(
              `${rowData?.projectUrl}/task/taskInfo/${rowData?.assignmentId}`
            )
          }}
          table={table}
          columns={[
            {
              title: '任务标题',
              key: 'assignmentTitle',
              align: 'center',
              width: 200,
              ellipsis: true,
              render: (address) => (
                <Tooltip placement="topLeft" content={address}>
                  {address}
                </Tooltip>
              ),
            },
            // {
            //   title: '任务ID',
            //   key: 'assignmentId',
            // },
            {
              title: '项目名称',
              key: 'name',
              align: 'center',
              // width: 200,
              ellipsis: true,
              render: (name) => (
                <Tooltip placement="topLeft" content={name}>
                  {name}
                </Tooltip>
              ),
            },

            {
              title: '任务状态',
              align: 'center',
              key: 'assignmentStatus',
              width: 80,
              render: (text) => {
                if (text === 1) {
                  return <Tag color="#F95C2B">未开始</Tag>
                } else if (text === 2) {
                  return <Tag color="#008EF0">进行中</Tag>
                } else if (text === 3) {
                  return <Tag color="#28a745">已完成</Tag>
                } else if (text === 4) {
                  return <Tag color="#dc3545">已逾期</Tag>
                }
              },
            },
            {
              title: '创建人',
              key: 'createName',
              align: 'center',
              // width: 200,
            },
            {
              title: '截止时间',
              key: 'dueDate',
              align: 'center',
              // width: 200,
              render: (text) => <div>{text && convertToString(text)}</div>,
            },
          ]}
        />
      </div>
    )
  }
  return (
    <div>
      <Row gutter={20}>
        <Col fixed style={{ width: '75%' }}>
          <Card title="我的任务" bodyStyle={{ paddingTop: 0 }} bordered={false}>
            <Tabs
              // type="line"
              activeKey="1"
              style={{ marginBottom: 0 }}
              onTabClick={(tab, key, e) => {
                setTab(tab)
                table.onSearch()
              }}>
              <Tabs.Pane label="待处理" key="1">
                {TableList()}
              </Tabs.Pane>
              <Tabs.Pane label="进行中" key="2">
                {TableList()}
              </Tabs.Pane>
              <Tabs.Pane label="已逾期" key="4">
                {TableList()}
              </Tabs.Pane>
              <Tabs.Pane label="我创建的" key="5">
                {TableList()}
              </Tabs.Pane>
            </Tabs>
          </Card>
        </Col>
        <Col fixed style={{ width: '25%' }}>
          <Card title="成员动态" bordered={false}>
            <div
              className={styles.dynamicList}
              onScroll={(e) => divscrollFn(e)}>
              {newMemberList?.length === 0 ? (
                <Empty />
              ) : (
                <Steps
                  direction="vertical"
                  progressDot
                  status="error"
                  current={newMemberList?.length}
                  style={{ padding: '20px 0' }}>
                  {newMemberList?.map((a, key) => {
                    // const one =  a?.operatingRecords?.match(/@(\S*) /)?.at(1)
                    return (
                      <Steps.Step
                        title={convertToString(a?.createTime)}
                        key={key}
                        description={
                          <div className={styles.mouseList}>
                            <LinkText
                              link={`/${a.userName}`}
                              value={a.nickName}
                            />
                            {a.historyType === 1 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText link={`${a?.projectUrl}`}>
                                  【{a?.projectName}】
                                </LinkText>
                              </span>
                            ) : a.historyType === 2 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                              </span>
                            ) : a.historyType === 3 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                指派给了
                                <LinkText
                                  color="gray"
                                  link={`/${a.assignmentUserName}`}
                                  value={`@${a.assignmentUserName}`}
                                />
                              </span>
                            ) : a.historyType === 4 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                指派人取消了
                              </span>
                            ) : a.historyType === 5 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`/${a.userName}/${a.projectId}/milestone/milestoneInfo/${a.milestonesId}`}
                                  value={`${a.milestonesTitle}`}
                                />
                              </span>
                            ) : a.historyType === 6 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`/${a.userName}/${a.projectId}/milestone/milestoneInfo/${a.milestonesId}`}
                                  value={`${a.milestonesTitle}`}
                                />
                              </span>
                            ) : a.historyType === 7 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                将任务
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                {convertToString(a?.operatingRecords)}
                                {/* {a.dueDate} */}
                              </span>
                            ) : a.historyType === 8 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                截止日期移除了
                              </span>
                            ) : a.historyType === 9 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                <span className={styles.labelBox}>
                                  {labelBox(a?.labelsInfo)}
                                </span>
                                标签
                              </span>
                            ) : a.historyType === 10 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                标签
                              </span>
                            ) : a.historyType === 11 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  {' '}
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                指派给了
                              </span>
                            ) : a.historyType === 12 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                                指派给了
                              </span>
                            ) : a.historyType === 13 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                              </span>
                            ) : a.historyType === 14 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                              </span>
                            ) : a.historyType === 15 ? (
                              <span>
                                <LinkText
                                  className={styles.mouseList}
                                  color="gray"
                                  link={`/${a?.userName}`}>
                                  @{a?.userName}
                                </LinkText>
                                {convertToString(a?.operatingRecords)}
                                <LinkText
                                  link={`${a.projectUrl}/task/taskInfo/${a.assignmentId}`}
                                  value={`#${a.assignmentId}`}
                                />
                              </span>
                            ) : (
                              convertToString(a?.operatingRecords)
                            )}
                          </div>
                        }></Steps.Step>
                    )
                  })}
                </Steps>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
